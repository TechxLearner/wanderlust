
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    let totalListings = await Listing.countDocuments(); // this will count all the listing stored in database
    return res.render("./listings/listing.ejs", { allListings, totalListings });
    // console.log(allListings);
};

module.exports.newListingForm = (req, res) => {
    return res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner").populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    });
    if (!listing) {
        req.flash("error", "Listing Does not Exits!!");
        return res.redirect("/listings");
    }
    return res.render("./listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    return res.redirect("/listings");
};

module.exports.editListingForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Does not Exits!!");
        return res.redirect("/listings");
    }
    return res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid data for listing");
    }
    let { id } = req.params;
    let updatedValue = req.body.listing;
    let upListing = await Listing.findByIdAndUpdate(id, updatedValue);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        upListing.image = { url, filename };
        await upListing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    return res.redirect("/listings");
};