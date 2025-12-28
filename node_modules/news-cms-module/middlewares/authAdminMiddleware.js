const isAdmin = (req, res, next) => {
    //buat bagian admin autentikasi ini sesuai dengan tabel dan kebutuhan anda

    // 1. Cek apakah user sudah login (session ada)
    // if (!req.session || !req.session.user) {
    //     return res.redirect('/login'); // Redirect ke halaman login jika belum auth
    // }

    // 2. Cek apakah role user adalah ADMIN
    // Diasumsikan di tabel User Anda memiliki kolom 'role'
    // if (req.session.user.role !== 'ADMIN') {
    //     // Jika login tapi bukan admin, arahkan ke home atau beri error 403
    //     return res.status(403).render('error/403', { 
    //         message: 'Akses Ditolak: Anda bukan Administrator' 
    //     });
    // }

    // 3. Jika semua terpenuhi, lanjut ke controller
    next();
};

module.exports = { isAdmin };