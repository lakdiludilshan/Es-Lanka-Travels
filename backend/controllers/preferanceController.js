import Preference from "../models/preferanceModel.js";

// Save user preferences
export const savePreferences = async (req, res) => {
  try {
    const preference = new Preference(req.body);
    await preference.save();
    res.status(201).json({ message: "Preferences saved!", preference });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user preferences (admin)
export const getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find();
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get preferences by user email
export const getUserPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findOne({ email: req.params.email });
    if (!preferences) {
      return res.status(404).json({ message: "No preferences found" });
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
