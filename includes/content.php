<?php
/**
 * Site content in one place so pages stay clean.
 * IMAGES: portfolio/before-after images are SVG placeholders until real photos are added.
 * Drop JPG/WebP files into assets/img/portfolio/ and change the 'img' paths below.
 */

$SERVICES = [
    ['slug' => 'wedding-decoration', 'title' => 'Wedding Decoration', 'text' => 'Complete visual environments for the ceremony, from entrance to stage, designed as one story.', 'img' => 'assets/img/portfolio/p1.svg'],
    ['slug' => 'stage-decoration', 'title' => 'Stage Decoration', 'text' => 'Floral backdrops, drapes and lighting that frame the moments everyone will photograph.', 'img' => 'assets/img/portfolio/p2.svg'],
    ['slug' => 'mandap-decoration', 'title' => 'Mandap Decoration', 'text' => 'Traditional and contemporary mandaps, built with care for ritual and for the camera.', 'img' => 'assets/img/portfolio/p3.svg'],
    ['slug' => 'reception-decoration', 'title' => 'Reception Decoration', 'text' => 'Seating, table styling and a stage that carries the celebration into the evening.', 'img' => 'assets/img/portfolio/p4.svg'],
    ['slug' => 'engagement-decoration', 'title' => 'Engagement Decoration', 'text' => 'Intimate, refined setups for the first big celebration of your families coming together.', 'img' => 'assets/img/portfolio/p5.svg'],
    ['slug' => 'mehndi-decoration', 'title' => 'Mehndi Decoration', 'text' => 'Colourful, relaxed settings with lounge seating, drapes and warm lighting.', 'img' => 'assets/img/portfolio/p6.svg'],
    ['slug' => 'haldi-decoration', 'title' => 'Haldi Decoration', 'text' => 'Fresh marigold and floral styling, designed to be joyful and photograph beautifully.', 'img' => 'assets/img/portfolio/p1.svg'],
    ['slug' => 'floral-design', 'title' => 'Floral Design', 'text' => 'Arches, hanging installations and table arrangements made from seasonal flowers.', 'img' => 'assets/img/portfolio/p2.svg'],
    ['slug' => 'venue-styling', 'title' => 'Venue Styling', 'text' => 'Entrances, ceilings, pathways and lighting that make a hall feel like your own space.', 'img' => 'assets/img/portfolio/p3.svg'],
    ['slug' => 'corporate-events', 'title' => 'Corporate Events', 'text' => 'Polished staging and décor for launches, galas and private corporate celebrations.', 'img' => 'assets/img/portfolio/p4.svg'],
];

// category: Weddings | Reception | Engagement | Mehndi | Haldi | Luxury Decor | Corporate
$PORTFOLIO = [
    ['title' => 'Floral Mandap', 'category' => 'Weddings', 'img' => 'assets/img/portfolio/p1.svg'],
    ['title' => 'Ivory Reception Stage', 'category' => 'Reception', 'img' => 'assets/img/portfolio/p2.svg'],
    ['title' => 'Garden Engagement', 'category' => 'Engagement', 'img' => 'assets/img/portfolio/p3.svg'],
    ['title' => 'Mehndi Lounge', 'category' => 'Mehndi', 'img' => 'assets/img/portfolio/p4.svg'],
    ['title' => 'Marigold Haldi', 'category' => 'Haldi', 'img' => 'assets/img/portfolio/p5.svg'],
    ['title' => 'Champagne Ballroom', 'category' => 'Luxury Decor', 'img' => 'assets/img/portfolio/p6.svg'],
    ['title' => 'Brand Gala Stage', 'category' => 'Corporate', 'img' => 'assets/img/portfolio/p2.svg'],
    ['title' => 'Floral Entrance Arch', 'category' => 'Weddings', 'img' => 'assets/img/portfolio/p3.svg'],
];
$CATEGORIES = ['Weddings', 'Reception', 'Engagement', 'Mehndi', 'Haldi', 'Luxury Decor', 'Corporate'];

$BEFORE_AFTER = [
    'before' => 'assets/img/portfolio/before.svg',
    'after'  => 'assets/img/portfolio/after.svg',
];

$PROCESS = [
    ['Discover', 'Understand the event, venue, preferences and vision.'],
    ['Design', 'Create the visual direction and decoration concept.'],
    ['Build', 'Transform the venue into the planned environment.'],
    ['Celebrate', 'Deliver the final experience, so you can simply enjoy it.'],
];

$WHY = [
    ['Thoughtful Design', 'Every setup begins with your story, venue and guests, not a catalogue.'],
    ['Attention to Detail', 'From flower placement to light temperature, nothing is left to chance.'],
    ['Custom Concepts', 'Designs are created for you rather than copied from the last event.'],
    ['Professional Execution', 'An experienced team builds on schedule and clears up after.'],
    ['End-to-End Planning', 'One point of contact from first call to the final guest leaving.'],
];

// Add real testimonials here: ['quote' => '', 'name' => '', 'event' => '', 'photo' => null].
// The testimonials section is hidden while this list is empty (no invented reviews).
$TESTIMONIALS = [];
