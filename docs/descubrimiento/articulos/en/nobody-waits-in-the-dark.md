[REVISIÓN NATIVA PENDIENTE]

# **Nobody waits in the dark**

*"A field note on LCP, or why the first thing on screen is also a design decision."*

September 3, 2026  
Alan Cisneros Gonzalez and Mariana Valenzuela Anaya  
*Edited by Ameyali*

It's nine at night and you want something sweet. You pull into the usual drive-thru, roll up to the menu board, and stop. Three seconds go by. Five. Ten. The board is on; you can see your favorite coffee shop's logo, frozen. No prices. No products. Nothing moves.

Your first thought isn't "this is slow." It's "are they even open?" You check the mirror, figure out whether you can pull out of line without tapping the car behind you, and head to the bakery across the street, the one with the lights on and a frosted cake turning in the window.

Nobody waits in the dark. Not because they're impatient, but because a screen that doesn't move doesn't say "hang on." It says "closed."

The same misunderstanding happens thousands of times a day inside the products we design.

Picture any online store; let's just call it *the store*. Someone opens the app or types the address into a browser because they want a TV or a pair of sneakers. For the first few seconds, the screen isn't just empty. It's saying something. It's telling that person: "I'm not sure this works."

They can't tell their signal from their phone from our server. All they know is that nothing is happening. And leaving costs far less online than it does in a car: no one behind you, no trip around the block. Just a flick of the thumb.

## The technical name for a dark menu board

That exact moment, when something worth looking at finally shows up, has a name: **Largest Contentful Paint** (LCP).

It measures the time between the tap and the moment the largest visual block on the screen is drawn: the seasonal campaign banner on the home page, the main photo on a product page, the first row of results on a listing.

It's an odd one among technical metrics. It doesn't care how much code was downloaded or how many requests were resolved. It cares about when the customer gets the signal that says "we're open, and this is for you." Google draws the line for a good experience at **2.5 seconds**.[^1]

Count with me:

**One. Two… and a half…**

It's nothing when you count it. It's a lot when you're the one waiting.

Say that on a normal day, the store's home page loads in two to three seconds. *It lives on the edge of the yellow light.* Then the pressure arrives and the edge gives way: during a sale week, even with checkout holding steady, the product listing can spike to 20, 30, even 40 seconds on the busiest days.

Forty seconds. Almost a minute in front of a gray screen, just to see a list of sneakers.

That customer didn't leave because of the price, the catalog, or the product card. They left before there was any design to judge.

## What that's worth

It helps to put this in numbers. Designers tend to talk about friction and frustration, and those words don't carry much weight in a business review.

Let's use round numbers, purely as an illustration. In a typical week, the store gets 2,000,000 sessions with an average order value of \$80. Now suppose that opening the doors faster wins us just 5 basis points of conversion: **0.05%**.

What does 0.05% actually mean?

- 2,000,000 × 0.0005 = **1,000 extra orders**  
- 1,000 × \$80 = **\$80,000 in a single week**  
- Held for all 52 weeks of the year, **\$4.16 million**

*Five basis points.[^2]* A number so small it looks like noise in a report, and it's still worth \$80,000 a week.

This isn't a revenue promise. It's simple proportion. It tells you how big the prize is, not that you've already won it. But it changes the conversation: "the site feels slow" becomes "here's what's on the other side if we fix it."

## The uncomfortable part

The largest element on the screen, the one that sets the LCP, is almost always something we designed.

The hero image. The eight-banner carousel built so no category would feel left out. The gorgeous image that looks great in Figma and weighs four megabytes. The custom typeface that blocks the headline from rendering. The video that just had to go at the top.

LCP isn't an engineering metric we sit back and wait on. It's the sum of design decisions: how many banners, how heavy the image, what shows up first, what can wait, and the least that needs to be on screen for someone to know the store is open.

We've been there. A sales team once asked us for a radical home page redesign: they wanted it to look like an advertising window display, full of images, alerts, and information. LCP helped us explain that online, when you fill a page with countless visual elements, they all compete to be rendered, and that Google gives us tools to audit ourselves and make decisions based not only on the business, but also on how the product performs. We audited with Lighthouse and Google Analytics. The home page did get its redesign: it kept the most striking, eye-catching elements, and LCP landed in a healthy range.

Designing for those seconds means owning what people see while they wait in our drive-thru line, and letting them know we're open. It means, for example, adding loading states so the customer knows their content is on the way and that someone is taking care of them. It means designing the transition with the same care as the final content.

That screen full of gray blocks is a decision, too. We just don't usually make it on purpose.

---

*All figures in this article are hypothetical and for illustration only; they don't describe any real company.*

[^1]: Google, "Largest Contentful Paint (LCP)," web.dev: an LCP of 2.5 seconds or less, measured at the 75th percentile of page loads, is considered good. https://web.dev/articles/lcp

[^2]: A basis point (1 bps) is one hundredth of a percentage point: 1% equals 100 basis points, so 1 basis point equals 0.01%. It's the unit digital analytics uses to talk about small changes across millions of visits.
