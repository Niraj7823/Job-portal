import User from "../modules/User.js";
// forget password
//change password
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, email, bio, phone, company, location, headline, skills } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(bio !== undefined && { bio }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(location !== undefined && { location }),
        ...(headline !== undefined && { headline }),
        ...(skills !== undefined && { skills }),
      },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
