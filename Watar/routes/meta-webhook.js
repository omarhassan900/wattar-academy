const { requireAuth, requireRole } = require('../middleware/auth');

// Meta webhook configuration
// Set these in your environment or replace with your actual values
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'wattar_leads_2024';
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_TOKEN || '';
const APP_SECRET = process.env.META_APP_SECRET || '';

module.exports = (app, db) => {

    // Webhook verification (Meta sends a GET request to verify your endpoint)
    app.get('/api/meta-leads/webhook', (req, res) => {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        console.log('Meta webhook verification:', { mode, token, challenge: challenge ? 'present' : 'missing' });

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✓ Meta webhook verified successfully');
            return res.status(200).send(challenge);
        }

        console.error('✗ Meta webhook verification failed');
        return res.sendStatus(403);
    });

    // Webhook receiver (Meta sends a POST when a lead form is submitted)
    app.post('/api/meta-leads/webhook', (req, res) => {
        const body = req.body;

        console.log('Meta webhook received:', JSON.stringify(body, null, 2));

        // Must respond 200 quickly or Meta will retry
        res.sendStatus(200);

        // Process the lead data
        if (body.object === 'page') {
            body.entry.forEach(entry => {
                if (entry.changes) {
                    entry.changes.forEach(change => {
                        if (change.field === 'leadgen') {
                            const leadgenId = change.value.leadgen_id;
                            const pageId = change.value.page_id;
                            const formId = change.value.form_id;

                            console.log('New lead received! ID:', leadgenId);

                            // Fetch the actual lead data from Meta Graph API
                            fetchLeadData(leadgenId, db);
                        }
                    });
                }
            });
        }
    });

    // Fetch lead details from Meta Graph API
    function fetchLeadData(leadgenId, db) {
        if (!PAGE_ACCESS_TOKEN) {
            console.error('META_PAGE_TOKEN not set — cannot fetch lead data');
            // Still save a placeholder lead
            saveLead(db, { name: `Meta Lead #${leadgenId}`, source: 'facebook', notes: `Leadgen ID: ${leadgenId} (token not configured)` });
            return;
        }

        const url = `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${PAGE_ACCESS_TOKEN}`;

        // Use built-in https module (no extra dependencies needed)
        const https = require('https');
        https.get(url, (response) => {
            let data = '';
            response.on('data', chunk => { data += chunk; });
            response.on('end', () => {
                try {
                    const leadData = JSON.parse(data);
                    console.log('Lead data from Meta:', JSON.stringify(leadData, null, 2));

                    if (leadData.error) {
                        console.error('Meta API error:', leadData.error);
                        saveLead(db, { name: `Meta Lead #${leadgenId}`, source: 'facebook', notes: `Error: ${leadData.error.message}` });
                        return;
                    }

                    // Parse the field_data array into a usable object
                    const fields = {};
                    if (leadData.field_data) {
                        leadData.field_data.forEach(field => {
                            fields[field.name.toLowerCase()] = field.values[0];
                        });
                    }

                    // Map Meta fields to our leads table
                    const lead = {
                        name: fields.full_name || fields.name || fields.first_name || 'Unknown',
                        phone: fields.phone_number || fields.phone || null,
                        email: fields.email || null,
                        instrument: fields.instrument || fields.preferred_instrument || null,
                        age: fields.age || null,
                        source: 'facebook',
                        notes: `Auto-imported from Meta Lead Ad. Form fields: ${Object.keys(fields).join(', ')}`
                    };

                    saveLead(db, lead);
                } catch (err) {
                    console.error('Error parsing Meta lead data:', err);
                    saveLead(db, { name: `Meta Lead #${leadgenId}`, source: 'facebook', notes: `Parse error: ${err.message}` });
                }
            });
        }).on('error', (err) => {
            console.error('Error fetching lead from Meta:', err);
            saveLead(db, { name: `Meta Lead #${leadgenId}`, source: 'facebook', notes: `Fetch error: ${err.message}` });
        });
    }

    // Save lead to database
    function saveLead(db, lead) {
        // Check for duplicate by phone
        if (lead.phone) {
            db.get('SELECT id FROM leads WHERE phone = ?', [lead.phone], (err, existing) => {
                if (existing) {
                    console.log('Duplicate lead (phone already exists):', lead.phone);
                    return;
                }
                insertLead(db, lead);
            });
        } else {
            insertLead(db, lead);
        }
    }

    function insertLead(db, lead) {
        db.run(`
            INSERT INTO leads (name, phone, email, instrument, age, source, notes, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'), datetime('now'))
        `, [lead.name, lead.phone, lead.email, lead.instrument, lead.age, lead.source || 'facebook', lead.notes], function(err) {
            if (err) {
                console.error('Error saving Meta lead:', err);
            } else {
                console.log('✓ Meta lead saved successfully! ID:', this.lastID, 'Name:', lead.name);
            }
        });
    }

    // Admin endpoint to check webhook status
    app.get('/api/meta-leads/status', requireAuth, requireRole(['manager']), (req, res) => {
        db.all("SELECT COUNT(*) as count FROM leads WHERE source = 'facebook'", (err, result) => {
            res.json({
                webhook_url: 'https://watar.academy.mooo.com/api/meta-leads/webhook',
                verify_token: VERIFY_TOKEN,
                page_token_set: !!PAGE_ACCESS_TOKEN,
                app_secret_set: !!APP_SECRET,
                facebook_leads_count: result ? result[0].count : 0
            });
        });
    });
};
