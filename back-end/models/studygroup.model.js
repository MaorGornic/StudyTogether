const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studygroupSchema = new Schema(
  {
    title: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    phone: { type: String, required: true },
    imageUrl: { type: String, required: true },
    curAttendees: { type: Number, min: 0, default: 0, required: true },
    location: { type: { long: Number, lat: Number }, required: true },
    maxAttendees: { type: Number, min: 2, required: true },
    hostId: { type: mongoose.Types.ObjectId, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    seriesId: { type: mongoose.Types.ObjectId, required: true },
  },
  { collection: 'studygroups' }
);

const studygroup = mongoose.model('studygroup', studygroupSchema);

module.exports = studygroup;
