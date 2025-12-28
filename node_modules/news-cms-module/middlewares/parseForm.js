const parseContentBlocks = (req, res, next) => {
    if (req.body.contentBlocks && typeof req.body.contentBlocks === 'string') {
        try {
            req.body.contentBlocks = JSON.parse(req.body.contentBlocks);
        } catch (e) {
            return res.status(400).json({ success: false, error: 'Format konten tidak valid' });
        }
    }
    console.log("di parseform");
    next();
};

module.exports = {
    parseContentBlocks
}