const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //Index Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  ); //For Creating Listing Post Route

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search", async (req, res) => {
  const { q } = req.query; // Get the search query from the URL

  // If the query is empty, just redirect to the all listings page
  if (!q) {
    return res.redirect("/listings");
  }

  // Perform a case-insensitive search on the 'title' field
  const allListings = await Listing.find({
    title: { $regex: q, $options: "i" },
  });

  if (allListings.length === 0) {
    req.flash(
      "error",
      "No listings found matching your search. Please try again."
    );
    return res.redirect("/listings");
  }

  // Render the same index page, but with the filtered listings
  res.render("listings/index.ejs", { allListings });
});

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //Show Route For the Listing
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) //Update Route for the Listing
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //Delete Route For the Listing

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Search Route

module.exports = router;
