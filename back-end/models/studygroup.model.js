const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studygroupSchema = new Schema(
  {
    title: { type: String, required: true },
    time: { type: Date, required: true },
    phone: { type: String, required: true },
    imageUrl: { type: String, required: true },
    curAttendees: { type: Number, min: 0, required: true },
    maxAttendees: { type: Number, min: 2, required: true },
    hostFirstName: { type: String, required: true },
    hostLastName: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  { collection: 'studygroups' }
);

const studygroup = mongoose.model('studygroup', studygroupSchema);

module.exports = studygroup;