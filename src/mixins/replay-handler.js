const replyHandler = {
    data() {
        return {
            _replyHandler: reply => this._handleReply(reply),
            _unhandledActions: {},
        }; 
    },

    method: {
        _handleReply(reply) {
            const cb = this._unhandledActions[reply.id];
            if (cb) {
                this._unhandledActions[reply.id](reply);
                delete this._unhandledActions[reply.id];
            }
        },

        waitReply(aid, cb) {
            this._unhandledActions[aid] = cb;
        },
    },
};

export default replyHandler;