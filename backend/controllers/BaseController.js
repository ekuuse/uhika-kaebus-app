class BaseController {
    async handleRequest(req, res, callback) {
        try {
            await callback(req, res);
        } catch (error) {
            console.error('Error in request handler:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Internal Server Error.',
                error: error.message
            });
        }
    }
}

module.exports = BaseController;