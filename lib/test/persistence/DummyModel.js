var mongoose = require('mongoose'), Schema = mongoose.Schema, Mixed = Schema.Types.Mixed, DummySchema = new Schema({
    _id: { type: String, unique: true },
    key: { type: String, required: true },
    content: { type: String, required: false }
}, {
    collection: 'dummies',
    autoIndex: true
});
DummySchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
module.exports = function (connection) {
    return connection.model('Dummy', DummySchema);
};
