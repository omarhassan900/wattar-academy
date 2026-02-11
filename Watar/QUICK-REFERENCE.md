# Wattar Academy - Quick Reference Card

## 🚀 Quick Start
```bash
node server.js
# Access: http://localhost:3000
# Login: admin / admin123
```

## 👥 User Roles
- **Manager:** Full access
- **Reception:** Students, Classes, Attendance
- **Trainer:** Own students only

## 🔑 Default Accounts
```
admin / admin123 (Manager)
fady / fady123 (Trainer - Piano, Vocal)
tema / tema123 (Trainer - Guitar)
romario / romario123 (Trainer - Violin)
```

## 📱 Main Features
1. **Students** - Add/Edit/View students with trainer assignment
2. **Attendance** - Mark attendance (4 sessions per month)
3. **Session Summary** - Track progress across all months
4. **Cash** - Income/Expense tracking (Manager only)
5. **Users** - User management (Manager only)
6. **Reports** - Analytics and statistics
7. **Classes** - Class scheduling

## 💰 Cash Categories
**Income:** Piano, Violin, Guitar, Vocal, Oud, Daraboka, Drums, Art, Instrument Sell, Watar Band  
**Expense:** Trainers, Salaries, Cleaning, Repairs, Rent, Manager Cash, Buffet, Electricity, Marketing

## 📊 System Stats
- 91 Students
- 6 Users
- 36 Sessions (4 per month × 9 months)
- 3 Trainers
- 19 Cash Categories

## 🔧 Production Deployment
```bash
npm install -g pm2
pm2 start server.js --name wattar-academy
pm2 save
pm2 startup
```

## 📁 Important Files
- `server.js` - Main application
- `wattar.db` - Database
- `PRODUCTION-READY.md` - Full deployment guide
- `FINAL-SUMMARY.md` - Complete documentation

## ⚠️ Before Production
- [ ] Change all passwords
- [ ] Update session secret
- [ ] Set up backups
- [ ] Test all features

## 🎯 Status: READY FOR PRODUCTION ✅
