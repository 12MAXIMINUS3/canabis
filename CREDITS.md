# Photo credits

All photographs in `public/images/` come from [Pexels](https://www.pexels.com) and are used under the
[Pexels licence](https://www.pexels.com/license/): free for commercial and non-commercial use, no attribution
required, no permission needed. Attribution is given here anyway because it costs nothing.

Nothing in this project is copied from a live dispensary's website. Product photography on commercial
storefronts is copyrighted by those businesses or their photographers and cannot be reused.

Each source photo can be viewed at `https://www.pexels.com/photo/<id>/`.

## Products — `public/images/products/`

| File | Pexels ID |
| --- | --- |
| aurora-haze.jpg | 3047447 |
| midnight-orchard.jpg | 6462279 |
| pacific-fog.jpg | 7667737 |
| sunrise-gummies.jpg | 1236662 |
| cocoa-noir-squares.jpg | 4113364 |
| stillwater-tea.jpg | 32908162 |
| northline-cart.jpg | 9419514 |
| driftwood-aio.jpg | 11587603 |
| glacier-live-rosin.jpg | 8139076 |
| pressed-hash-block.jpg | 9550954 |
| clearfield-cbd-oil.jpg | 7852732 |
| trailhead-balm.jpg | 7038197 |
| brass-grinder.jpg | 11652817 |
| cedar-stash-jar.jpg | 8139072 |

## Categories — `public/images/categories/`

| File | Pexels ID |
| --- | --- |
| flower.jpg | 5302082 |
| edibles.jpg | 5469042 |
| vapes.jpg | 5495435 |
| concentrates.jpg | 8334638 |
| cbd.jpg | 7852740 |
| accessories.jpg | 6486358 |

## Brand & process — `public/images/brand/`

| File | Pexels ID |
| --- | --- |
| hero-card.jpg | 8139077 |
| about-grow.jpg | 5877988 |
| process-source.jpg | 5635391 |
| process-cure.jpg | 9146962 |
| process-test.jpg | 9259936 |
| process-pack.jpg | 6169019 |

## Team — `public/images/team/`

| File | Pexels ID |
| --- | --- |
| sourcing.jpg | 5810898 |
| quality.jpg | 7230411 |
| fulfilment.jpg | 4498152 |
| support.jpg | 7709176 |

## Editorial — `public/images/editorial/`

| File | Pexels ID |
| --- | --- |
| tracking.jpg | 6994108 |
| vendors.jpg | 33325757 |
| mix-match.jpg | 8140236 |
| rewards.jpg | 7852559 |
| how-to-order.jpg | 8139194 |
| shipping.jpg | 6667673 |
| blog-terpenes.jpg | 7852651 |
| blog-dosing.jpg | 8139067 |
| blog-storage.jpg | 7852573 |
| blog-harvest.jpg | 8658545 |


## Hero backdrop — `public/images/hero/`

Reserved for the homepage hero and used nowhere else.

| File | Pexels ID |
| --- | --- |
| 01-trichomes.jpg | 30682042 |
| 02-bud-dark.jpg | 34246666 |
| 03-purple-bud.jpg | 35483695 |
| 04-greenhouse.jpg | 5810703 |
| 05-grow-lights.jpg | 5258391 |
| 06-plant-detail.jpg | 7584665 |
| 07-frosty-bud.jpg | 33856592 |
| 08-plant-rows.jpg | 20809624 |

## Hero video — `public/video/`

| File | Pexels video ID |
| --- | --- |
| hero-leaves.mp4 | 7667040 |
| hero-leaves-sd.mp4 | 7667040 |

## Catalogue expansion

The catalogue grew from 14 products to 60 (ten per category). The 46 additional
product photographs are named after the product they belong to in
`public/images/products/`, and each is a distinct Pexels photograph. Source IDs
are recorded in the download scripts and in this repository's commit history.

Every file above is a distinct photograph — no image is reused anywhere in the site.
Verified with `find public/images -name '*.jpg' -exec md5sum {} + | awk '{print $1}' | sort | uniq -d`
(returns nothing).
