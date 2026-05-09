import User from "../models/User.js";
import { normalizePhone, isValidPhone } from "../utils/phone.js";

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar || "",
  addresses: user.addresses,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const cleanString = (value) =>
  typeof value === "string" ? value.trim() : value;

export const updateProfile = async (req, res) => {
  try {
    let { name, email, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }



    name = typeof name === "string" ? name.trim() : name;
    email = typeof email === "string" ? email.trim().toLowerCase() : email;
    phone = typeof phone === "string" ? phone.trim() : phone;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }

      user.email = email;
    }

    if (name !== undefined) {
      if (!name) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      user.name = name;
    }

    if (phone !== undefined) {
      if (phone && !isValidPhone(phone)) {
        return res.status(400).json({ message: "Enter a valid phone number" });
      }

      const normalizedPhone = phone ? normalizePhone(phone) : "";

      const duplicateInsideCurrentUser =
        normalizedPhone &&
        user.addresses.some((address) => address.phoneNormalized === normalizedPhone);

      if (duplicateInsideCurrentUser) {
        return res.status(400).json({
          message: "This phone number is already used in your saved addresses",
        });
      }

      if (normalizedPhone) {
        const duplicateInOtherUsers = await User.findOne({
          _id: { $ne: user._id },
          $or: [
            { phoneNormalized: normalizedPhone },
            { "addresses.phoneNormalized": normalizedPhone },
          ],
        });

        if (duplicateInOtherUsers) {
          return res.status(400).json({
            message: "This phone number is already used by another account",
          });
        }
      }

      user.phone = phone || "";
      user.phoneNormalized = normalizedPhone;
    }
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addAddress = async (req, res) => {
  try {
    let {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    fullName = fullName?.trim();
    phone = phone?.trim();
    street = street?.trim();
    city = city?.trim();
    state = state?.trim();
    postalCode = postalCode?.trim();
    country = country?.trim();

    if (!fullName || !phone || !street || !city || !state || !postalCode || !country) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Enter a valid phone number" });
    }

    const normalizedPhone = normalizePhone(phone);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneNormalized && user.phoneNormalized === normalizedPhone) {
      return res.status(400).json({
        message: "This phone number is already used in your profile",
      });
    }

    const duplicateInsideCurrentUser = user.addresses.some(
      (address) => address.phoneNormalized === normalizedPhone
    );

    if (duplicateInsideCurrentUser) {
      return res.status(400).json({
        message: "This phone number is already used in your saved addresses",
      });
    }

    const duplicateInOtherUsers = await User.findOne({
      _id: { $ne: user._id },
      $or: [
        { phoneNormalized: normalizedPhone },
        { "addresses.phoneNormalized": normalizedPhone },
      ],
    });

    if (duplicateInOtherUsers) {
      return res.status(400).json({
        message: "This phone number is already used by another account",
      });
    }

    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    user.addresses.push({
      fullName,
      phone,
      phoneNormalized: normalizedPhone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault: Boolean(isDefault),
    });

    if (user.addresses.length === 1) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      user,
    });
  } catch (error) {
    console.error("addAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    let {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (fullName !== undefined) fullName = fullName.trim();
    if (phone !== undefined) phone = phone.trim();
    if (street !== undefined) street = street.trim();
    if (city !== undefined) city = city.trim();
    if (state !== undefined) state = state.trim();
    if (postalCode !== undefined) postalCode = postalCode.trim();
    if (country !== undefined) country = country.trim();

    if (phone !== undefined) {
      if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ message: "Enter a valid phone number" });
      }

      const normalizedPhone = normalizePhone(phone);

      if (user.phoneNormalized && user.phoneNormalized === normalizedPhone) {
        return res.status(400).json({
          message: "This phone number is already used in your profile",
        });
      }

      const duplicateInsideCurrentUser = user.addresses.some(
        (item) =>
          String(item._id) !== String(addressId) &&
          item.phoneNormalized === normalizedPhone
      );

      if (duplicateInsideCurrentUser) {
        return res.status(400).json({
          message: "This phone number is already used in your saved addresses",
        });
      }

      const duplicateInOtherUsers = await User.findOne({
        _id: { $ne: user._id },
        $or: [
          { phoneNormalized: normalizedPhone },
          { "addresses.phoneNormalized": normalizedPhone },
        ],
      });

      if (duplicateInOtherUsers) {
        return res.status(400).json({
          message: "This phone number is already used by another account",
        });
      }

      address.phone = phone;
      address.phoneNormalized = normalizedPhone;
    }

    if (fullName !== undefined) address.fullName = fullName;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;

    if (typeof isDefault === "boolean") {
      if (isDefault) {
        user.addresses.forEach((item) => {
          item.isDefault = false;
        });
        address.isDefault = true;
      } else {
        address.isDefault = false;
      }
    }

    if (!user.addresses.some((item) => item.isDefault) && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      user,
    });
  } catch (error) {
    console.error("updateAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.deleteOne();

    if (user.addresses.length > 0 && !user.addresses.some((item) => item.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("deleteAddress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};