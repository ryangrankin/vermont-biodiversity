const licenses = {
  "CC BY 2.0":
    "https://creativecommons.org/licenses/by/2.0/",
  "CC BY-SA 2.0":
    "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-NC 2.0":
    "https://creativecommons.org/licenses/by-nc/2.0/",
  "CC BY-ND 2.0":
    "https://creativecommons.org/licenses/by-nd/2.0/",
  "CC BY-NC-ND 2.0":
    "https://creativecommons.org/licenses/by-nc-nd/2.0/",
  "CC BY-NC-SA 2.0":
    "https://creativecommons.org/licenses/by-nc-sa/2.0/",
  "Public Domain Mark 1.0":
    "https://creativecommons.org/publicdomain/mark/1.0/",
};

function credit(
  title: string,
  author: string,
  license: keyof typeof licenses,
  imageUrl?: string
) {
  return {
    title,
    author,
    license,
    licenseUrl: licenses[license],
    imageUrl,
  };
}

export const photoCredits = {
  // PAGE BACKGROUNDS

  trees: credit(
    "Vermont Tree",
    "cambodia4kidsorg",
    "CC BY 2.0",
    "https://openverse.org/image/8cf05381-c664-418e-9bcc-40b3370152fb"
  ),

  sightings: credit(
    "Forest",
    "chornamariya",
    "CC BY 2.0",
    "https://openverse.org/image/f0d2374f-64d3-4745-a14a-59265be4b8ee"
  ),

  gallery: credit(
    "Forest",
    "Sergey Galyonkin",
    "CC BY-SA 2.0",
    "https://openverse.org/image/5879e556-4654-42f6-8262-87818701f7de"
  ),

  survey: credit(
    "Forest",
    "walker.s",
    "CC BY-NC 2.0"
  ),

  login: credit(
    "Black bear, Blacktail Plateau Drive",
    "YellowstoneNPS",
    "Public Domain Mark 1.0"
  ),

  homepage: credit(
    "Vermont",
    "vigour",
    "CC BY 2.0"
  ),

  pollinators: credit(
    "Pollinator Garden",
    "U.S. Fish and Wildlife Service - Midwest Region",
    "Public Domain Mark 1.0"
  ),

  helpful: credit(
    "Golden Rod",
    "MarilynJane",
    "CC BY 2.0"
  ),

  plants: credit(
    "Field Of Wildflowers",
    "Ken Mattison",
    "CC BY-NC-ND 2.0"
  ),

  animals: credit(
    "Moose",
    "Alex Butterfield",
    "CC BY-ND 2.0"
  ),

  // ANIMAL CATEGORY BACKGROUNDS

  mammals: credit(
    "Beaver, Lamar River",
    "YellowstoneNPS",
    "Public Domain Mark 1.0"
  ),

  insects: credit(
    "Bumble bee on my lavender",
    "2jaysjoju",
    "CC BY-NC-ND 2.0"
  ),

  amphibians: credit(
    "Blue-spotted salamander (Ambystoma laterale)",
    "Greg Schechter",
    "CC BY 2.0"
  ),

  fish: credit(
    "cascade locks sturgeon underwater",
    "goodiesfirst",
    "CC BY 2.0"
  ),

  reptiles: credit(
    "Timber Rattlesnake (Crotalus horridus)",
    "2ndPeter",
    "CC BY 2.0"
  ),

  birds: credit(
    "RED-TAILEDHAWK",
    "Aquila-chrysaetos",
    "CC BY-NC 2.0"
  ),

  // INDIVIDUAL ANIMAL PHOTOS

  beaver: credit(
    "Beaver",
    "hehaden",
    "CC BY-NC 2.0"
  ),

  blackBear: credit(
    "American black bear",
    "Marie Hale",
    "CC BY 2.0"
  ),

  littleBrownBat: credit(
    "Little brown bat",
    "USFWS Headquarters",
    "CC BY 2.0"
  ),

  easternRibbonsnake: credit(
    "Eastern ribbonsnake (Thamnophis sauritus)",
    "Adam Balzer",
    "CC BY-NC-ND 2.0"
  ),

  spottedSalamander: credit(
    "Blue Spotted Salamander (Ambystoma laterale)",
    "2ndPeter",
    "CC BY 2.0"
  ),

  americanGoldfinch: credit(
    "American Goldfinch",
    "Kinchan1",
    "CC BY 2.0"
  ),

  bumblebee: credit(
    "Morning feast",
    "eclectic echoes",
    "CC BY-NC-ND 2.0"
  ),

  // INDIVIDUAL PLANT PHOTOS

  americanChestnut: credit(
    "American chestnut tree in Lincoln",
    "yfederowicz",
    "CC BY-NC-SA 2.0"
  ),

  goldenrod: credit(
    "Goldenrod",
    "Nicholas Erwin",
    "CC BY-NC-ND 2.0"
  ),

  milkweed: credit(
    "Common milkweed-tracy",
    "tracy from north brookfield,Massachusetts, usa",
    "CC BY 2.0"
  ),

  aster: credit(
    "Hairy Heart-leaved Aster",
    "Anita363",
    "CC BY-NC 2.0"
  ),
};

const imageIds = {
  trees: "8cf05381-c664-418e-9bcc-40b3370152fb",
  sightings: "f0d2374f-64d3-4745-a14a-59265be4b8ee",
  gallery: "5879e556-4654-42f6-8262-87818701f7de",
  survey: "f2e1e225-4228-4c15-9b78-16f4f4b17756",
  login: "e7d90d08-6812-4aae-a4e0-2580004c73d6",
  homepage: "6eb577da-3352-48db-81bd-359271ac5762",
  pollinators: "ce9feed4-4b9d-4021-8bdd-e5e52a89fda0",
  helpful: "d1635576-b36b-48c4-a41d-8bb4-a41d0ef39750",
  plants: "565af4a5-6fff-4b2e-8b87-6495a46f4ac7",
  animals: "d7a3cc06-4a34-4c8f-876e-1caf17535467",
  mammals: "560fbd62-684d-4c9a-a363-c58cb4bef87f",
  insects: "b0ddd303-71b7-4928-bc48-d042bb59900b",
  amphibians: "b85e4031-2a06-4748-a9ed-1af4134655c6",
  fish: "dc47cb5f-5cb8-434f-9fd8-f846e0044fc4",
  reptiles: "255d8dbb-d22c-4671-8871-e6bbe2a95b4d",
  birds: "e9ca5c88-ba4b-44d1-8888-f904f9fdbc66",
  beaver: "6f6fcc83-0d73-4d78-b641-c1a8fa101e58",
  blackBear: "3ddffd7e-513c-4b13-9644-9fc4052f435d",
  littleBrownBat: "06dc61d8-d63f-4b8c-9d55-2da7714e3647",
  easternRibbonsnake: "f32cd5c1-74a9-40ed-a91a-8f120b95a5eb",
  spottedSalamander: "71350cf8-65fb-4a03-8613-f3f233c07905",
  americanGoldfinch: "6c2ca356-834f-427f-b838-47fa1d7d917a",
  bumblebee: "e76112d0-01e6-4685-8bd0-5039db88d3da",
  americanChestnut: "835843fb-71d9-40d4-b72e-dce6a9bab96b",
  goldenrod: "680f66f7-1f30-496a-b0b4-0bcdc33ab8b3",
  milkweed: "6d6d12d6-231c-46fb-9f5e-97d55f25f485",
  aster: "e2dac293-dc63-48c3-9e98-c8eddaf38818",
};

for (const key of Object.keys(imageIds) as (keyof typeof imageIds)[]) {
  photoCredits[key].imageUrl =
    `https://openverse.org/image/${imageIds[key]}`;
}