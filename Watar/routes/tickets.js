const { requireAuth, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure upload directory exists
const ticketUploadDir = 'public/uploads/tickets';
try { if (!fs.existsSync(ticketUploadDir)) fs.mkdirSync(ticketUploadDir, { recursive: true }); } catch(e) { console.log('Note: Could not create tickets upload dir:', e.message); }

// Configure multer for payment screenshot uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, ticketUploadDir),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + crypto.randomBytes(4).toString('hex') + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedExt = /jpeg|jpg|png|webp|heic|heif/;
        const allowedMime = /image\//;
        const ext = allowedExt.test(path.extname(file.originalname).toLowerCase());
        const mime = allowedMime.test(file.mimetype);
        if (ext || mime) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    }
});

const TICKET_PRICE = 150;
const TICKET_LIMIT = 144;
const EVENT_NAME = 'Watar Academy Concert';
const EVENT_DATE = '27 June 2026';
const INSTAPAY_NUMBER = '01026502916';

module.exports = (app, db) => {

    // Public: Ticket reservation page
    app.get('/concert', (req, res) => {
        db.get("SELECT COUNT(*) as sold FROM tickets WHERE status IN ('pending', 'approved')", (err, row) => {
            const ticketsSold = row ? row.sold : 0;
            const available = TICKET_LIMIT - ticketsSold;
            // Get taken seats for the visual
            db.all("SELECT seat_number, buyer_name FROM tickets WHERE status = 'approved' AND seat_number IS NOT NULL", (err, rows) => {
                const takenSeats = {};
                (rows || []).forEach(r => {
                    r.seat_number.split(',').forEach(s => { takenSeats[s.trim()] = r.buyer_name; });
                });
                res.render('public-ticket', {
                    eventName: EVENT_NAME,
                    eventDate: EVENT_DATE,
                    ticketPrice: TICKET_PRICE,
                    instapayNumber: INSTAPAY_NUMBER,
                    available,
                    soldOut: available <= 0,
                    takenSeats
                });
            });
        });
    });

    // Public: Submit ticket reservation
    app.post('/concert/reserve', (req, res) => {
        upload.single('payment_screenshot')(req, res, function(err) {
            if (err) {
                return res.json({ success: false, error: err.message || 'File upload error' });
            }

            const { buyer_name, buyer_phone, buyer_email } = req.body;

            if (!buyer_name || !buyer_phone) {
                return res.json({ success: false, error: 'Name and phone are required' });
            }
            if (!req.file) {
                return res.json({ success: false, error: 'Payment screenshot is required' });
            }

            // Check availability
            db.get("SELECT COUNT(*) as sold FROM tickets WHERE status IN ('pending', 'approved')", (err, row) => {
                if (row && row.sold >= TICKET_LIMIT) {
                    return res.json({ success: false, error: 'Sorry, tickets are sold out!' });
                }

                const screenshotPath = '/uploads/tickets/' + req.file.filename;

                db.run(`INSERT INTO tickets (buyer_name, buyer_phone, buyer_email, payment_screenshot, ticket_token)
                        VALUES (?, ?, ?, ?, ?)`,
                    [buyer_name, buyer_phone, buyer_email || null, screenshotPath, require('crypto').randomBytes(16).toString('hex')],
                    function(err) {
                        if (err) {
                            console.error('Error saving ticket:', err);
                            return res.json({ success: false, error: 'Something went wrong' });
                        }
                        // Return the token so buyer can check their ticket status
                        db.get("SELECT ticket_token FROM tickets WHERE id = ?", [this.lastID], (err, row) => {
                            res.json({ success: true, token: row ? row.ticket_token : null });
                        });
                    }
                );
            });
        });
    });

    // Public: View ticket status/ticket
    app.get('/concert/ticket/:token', (req, res) => {
        const { token } = req.params;
        db.get("SELECT * FROM tickets WHERE ticket_token = ?", [token], (err, ticket) => {
            if (err || !ticket) {
                return res.status(404).send('<html><body style="font-family:sans-serif;text-align:center;padding:50px;background:#000;color:#fff;"><h2>Ticket not found</h2><p>This ticket link is invalid.</p></body></html>');
            }
            // Get taken seats for the map
            db.all("SELECT seat_number, buyer_name FROM tickets WHERE status = 'approved' AND seat_number IS NOT NULL", (err, rows) => {
                const takenSeats = {};
                (rows || []).forEach(r => {
                    r.seat_number.split(',').forEach(s => {
                        takenSeats[s.trim()] = r.buyer_name;
                    });
                });
                res.render('public-ticket-view', {
                    ticket,
                    eventName: EVENT_NAME,
                    eventDate: EVENT_DATE,
                    takenSeats
                });
            });
        });
    });

    // Admin: Manage tickets
    app.get('/admin/tickets', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const user = req.session.user;
        db.all("SELECT * FROM tickets ORDER BY created_at DESC", (err, tickets) => {
            if (err) tickets = [];
            const stats = {
                total: tickets.length,
                pending: tickets.filter(t => t.status === 'pending').length,
                approved: tickets.filter(t => t.status === 'approved').length,
                rejected: tickets.filter(t => t.status === 'rejected').length
            };
            res.render('admin-tickets', { user, tickets: tickets || [], stats, TICKET_LIMIT }, (err, html) => {
                if (err) { console.error(err); return res.status(500).send('Render error'); }
                res.render('layout', { body: html, user });
            });
        });
    });

    // Admin: Approve ticket
    app.post('/admin/tickets/:id/approve', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const { id } = req.params;
        const { seat_number } = req.body;
        const user = req.session.user;

        if (!seat_number) return res.json({ success: false, error: 'Seat number is required' });

        // Parse multiple seats (comma-separated)
        const seats = seat_number.split(',').map(s => s.trim()).filter(s => s);
        
        // Check if any seat is already taken
        db.all("SELECT seat_number FROM tickets WHERE status = 'approved' AND seat_number IS NOT NULL", (err, rows) => {
            const allTaken = new Set();
            (rows || []).forEach(r => {
                r.seat_number.split(',').forEach(s => allTaken.add(s.trim()));
            });
            
            const conflicts = seats.filter(s => allTaken.has(s));
            if (conflicts.length > 0) {
                return res.json({ success: false, error: 'Seats already taken: ' + conflicts.join(', ') });
            }

            db.run(`UPDATE tickets SET status = 'approved', seat_number = ?, approved_by = ?, approved_at = datetime('now') WHERE id = ?`,
                [seat_number, user.id, id], function(err) {
                    if (err) return res.json({ success: false, error: 'Database error' });
                    db.get("SELECT ticket_token FROM tickets WHERE id = ?", [id], (err, row) => {
                        res.json({ success: true, token: row ? row.ticket_token : null });
                    });
                }
            );
        });
    });

    // API: Get taken seats
    app.get('/admin/tickets/seats', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        db.all("SELECT seat_number, buyer_name FROM tickets WHERE status = 'approved' AND seat_number IS NOT NULL", (err, rows) => {
            if (err) return res.json({ success: false });
            const taken = {};
            (rows || []).forEach(r => {
                // Handle multiple seats per ticket (comma-separated)
                r.seat_number.split(',').forEach(s => {
                    taken[s.trim()] = r.buyer_name;
                });
            });
            res.json({ success: true, taken });
        });
    });

    // Admin: Reject ticket
    app.post('/admin/tickets/:id/reject', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;

        db.run(`UPDATE tickets SET status = 'rejected', rejection_reason = ? WHERE id = ?`,
            [reason || 'Payment not verified', id], function(err) {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true });
            }
        );
    });

    // Admin: Cancel (revoke) an approved ticket — frees up the seats
    app.post('/admin/tickets/:id/cancel', requireAuth, requireRole(['manager', 'reception']), (req, res) => {
        const { id } = req.params;

        db.run(`UPDATE tickets SET status = 'rejected', seat_number = NULL, rejection_reason = 'Cancelled by admin' WHERE id = ?`,
            [id], function(err) {
                if (err) return res.json({ success: false, error: 'Database error' });
                res.json({ success: true });
            }
        );
    });
};
