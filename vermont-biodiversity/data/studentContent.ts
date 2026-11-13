/*
====================================================
          LEGO CLUB BIODIVERSITY APP
              STUDENT CONTENT
====================================================

WELCOME, LEGO CLUB!

This is YOUR app!

Your job is to decide what information appears
in the app. The developer will make it work.

Look for the sections labeled:

       STUDENTS: FILL IN HERE

You only need to write inside the quotation marks.

====================================================
*/


// ==================================================
// SECTION 1: APP NAME AND WELCOME PAGE
// ==================================================

export const appInfo = {

  // STUDENTS: What is your app's name?
  name: "VTBiodiversity",

  // STUDENTS: Write a short slogan for your app.
  tagline: "Every Vermonter can help!",

  // STUDENTS: Write a welcome message explaining
  // what your app does and why it matters.
  welcome: "Sign in to explore Vermont wildlife, complete your biodiversity survey and get your personalized recommendations for helping to protect Vermont's natural environment",

};


 // ============================================================
 // DASHBOARD CONTENT
 // ============================================================
 // STUDENTS: Edit the text inside the quotation marks.
 // Your changes will appear on the Biodiversity Dashboard.
 // Do not delete the quotation marks or commas.
 // ============================================================

export const dashboardContent = {
  // Welcome message below "Your Biodiversity Dashboard"
  welcome: "Every Vermonter can help!",

  // Description inside the Animals card
  animalsDescription: "",

  // Description inside the Plants & Gardens card
  plantsDescription: "",

  // Description inside the Wildlife Cam card
  wildlifeDescription: "",
};


// ==================================================
// SECTION 2: SURVEY QUESTIONS
// ==================================================

/*
STUDENTS:

These questions are based on your original idea!

You can change the wording of each question.

For questions with answer options, write your
answers inside the quotation marks.

You can also suggest additional questions.
*/

// ==========================================
// SURVEY INTRODUCTION
// ==========================================

// STUDENTS: Write a short introduction explaining
// why users should complete this survey.

export const surveyContent = {
  introduction: "Answer these questions so we can find the right recomandations for you!",
};

export const surveyQuestions = [

    
  // QUESTION 1: LOCATION
  {
    
    id: "location",

    // STUDENTS: How should we ask about location?
    question: "replace this text with your answer about location",

    // STUDENTS: What location choices should users have?
    options: [
      "replace this text with choice 1",
      "replace this text with choice 2",
      "replace this text with choice 3",
    ],
  },

  // QUESTION 2: LAWN
  {
    id: "lawn",

    // STUDENTS: Write your question about lawns.
    question: "Do you have a Lawn?",

    options: [
      "Yes", // STUDENTS: First answer choice
      "No", // STUDENTS: Second answer choice
    ],
  },

  // QUESTION 3: GARDEN
  {
    id: "garden",

    // STUDENTS: Write your question about gardens.
    question: "Do you have a garden?",

    options: [
      "Yes",
      "No",
    ],
  },

  // QUESTION 4: PETS
  {
    id: "pets",

    // STUDENTS: Write your question about pets.
    question: "Do you have a pet?",

    options: [
      "Yes",
      "No",
    ],
  },

  // QUESTION 5: OUTDOOR INTERESTS
  {
    id: "interests",

    // STUDENTS: Ask users what activities they enjoy.
    question: "What outdoor hobbies do you have?",

    // STUDENTS: Add activities people can choose.
    options: [
      "Hiking",
      "Mountian Biking",
      "Boating",
      "Birdwatching",
      "Volunteering",
    ],
  },

];


// ==================================================
// SECTION 3: BIODIVERSITY RECOMMENDATIONS
// ==================================================

/*
STUDENTS:

This is one of the most important parts of your app!

Each recommendation tells someone how they
can help protect Vermont's biodiversity.

For each recommendation, decide:

1. What should someone do?
2. Why does it help?
3. Who should receive this tip?
4. What time of year is it relevant?
5. Where did you find the information?

You can copy and paste the recommendation
template to add more tips!
*/

export const recommendations = [

  // RECOMMENDATION 1
  {
    id: 1,

    // STUDENTS: Give your recommendation a title.
    title: "What to do with if you find a bat",

    // STUDENTS: Explain what the user should do.
    description: "If you find a bat, don’t put it outside in the winter because it will freeze to death. Instead, contact the Vermont Bat Center. When bats are hibernating, they breathe slowly and their heart rate drops to one or two beats per minute. If you find one while it is asleep, it seems dead and takes 20 minutes to wake up. ",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "So you don't kill bats unknowingly",

    // STUDENTS: Which survey interests match this tip?
    // Use the same words as the survey answer choices.
    interests: [
      "Interest1",
      "interest2",
      "interest3",
    ],

    // STUDENTS: Does the user need a lawn?
    // Change to true if yes.
    requiresLawn: false,

    // STUDENTS: Does the user need a garden?
    // Change to true if yes.
    requiresGarden: false,

    // STUDENTS: Which months should this tip appear?
    // January = 1, February = 2 ... December = 12
    months: [1, 11, 12] as number[],

    // STUDENTS: Where did you find this information?
    source: "https://www.vermontbatcenter.org/",


  // STUDENTS: Link this recommendation to an animal or plant.

  learnMore: {
    type: "animal",
    id: "little-brown-bat",
    label: "Learn more about Little Brown Bats",
  },

  },

  // RECOMMENDATION 2
  {
    id: 2,

    // STUDENTS: Give your recommendation a title.
    title: "When to say NO to Bats",

    // STUDENTS: Explain what the user should do.
    description: "In the fall and spring when they don’t have vulnerable young, block holes in attics and other spaces so they don’t roost in your home",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "Helps homeowners stop bats from living in their home in a way that keeps the bats alive.",

    // STUDENTS: Which survey interests match this tip?
    // Use the same words as the survey answer choices.
    interests: [
      "interest1",
      "interest2",
      "interest3",
    ],

    // STUDENTS: Does the user need a lawn?
    // Change to true if yes.
    requiresLawn: false,

    // STUDENTS: Does the user need a garden?
    // Change to true if yes.
    requiresGarden: false,

    // STUDENTS: Which months should this tip appear?
    // January = 1, February = 2 ... December = 12
    months: [4, 9] as number[],

    // STUDENTS: Where did you find this information?
    source: "https://www.vtfishandwildlife.com/learn-more/vermont-critters/mammals/little-brown-bat https://vtdigger.org/2026/10/20/vermont-experts-say-bats-need-our-help-how-do-we-get-over-our-fear-of-them/https://www.sevendaysvt.com/arts-culture/work-barry-and-maureen-genzlinger-rescue-bats-10444077/",
  
    // STUDENTS: Link this recommendation to an animal or plant.

  learnMore: {
    type: "animal",
    id: "little-brown-bat",
    label: "Learn more about Little Brown Bats",
  },
  
  },

  // RECOMMENDATION 3
  {
    id: 3,

    // STUDENTS: Give your recommendation a title.
    title: "Donate!",

    // STUDENTS: Explain what the user should do.
    description: "Check the box on your Vermont income tax return that adds a contribution to the Vermont Fish and Wildlife Department nongame wildlife fund which supports animal conservation in Vermont.",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "It helps Vermont Fish and Wildlife get tools and people to help biodiversity.",

    // STUDENTS: Which survey interests match this tip?
    // Use the same words as the survey answer choices.
    interests: [
      "interest1",
      "interest2",
      "interest3",
    ],

    // STUDENTS: Does the user need a lawn?
    // Change to true if yes.
    requiresLawn: false,

    // STUDENTS: Does the user need a garden?
    // Change to true if yes.
    requiresGarden: false,

    // STUDENTS: Which months should this tip appear?
    // January = 1, February = 2 ... December = 12
    months: [1, 2, 3, 4] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  // STUDENTS: Link this recommendation to an animal or plant.

  learnMore: {
    type: "animal",
    id: "little-brown-bat",
    label: "Learn more about ...",
  },
  
  },

  // RECOMMENDATION 4
  {
    id: 4,

    // STUDENTS: Give your recommendation a title.
    title: "Keep your eyes open for amphibians and report what you see!",

    // STUDENTS: Explain what the user should do.
    description: "Amphibians migrate when it is above 40 degrees, dark and raining and between March and May. Help conservationists by reporting sightings.",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "This helps them understand the species and their range. Report sightings here: iNaturalist Vermont · iNaturalist",

    // STUDENTS: Which survey interests match this tip?
    // Use the same words as the survey answer choices.
    interests: [
      "interest1",
      "interest2",
      "interest3",
    ],

    // STUDENTS: Does the user need a lawn?
    // Change to true if yes.
    requiresLawn: false,

    // STUDENTS: Does the user need a garden?
    // Change to true if yes.
    requiresGarden: false,

    // STUDENTS: Which months should this tip appear?
    // January = 1, February = 2 ... December = 12
    months: [3, 4, 5, 10] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  // STUDENTS: Link this recommendation to an animal or plant.

  learnMore: {
    type: "animal",
    id: "little-brown-bat",
    label: "Learn more about ...",
  },
  },

  // RECOMMENDATION 5
  {
    id: 5,

    // STUDENTS: Give your recommendation a title.
    title: "Are you ready for a Big Night out? Go meet the amphibians and save some lives. ",

    // STUDENTS: Explain what the user should do.
    description: "Amphibians migrate when it is above 40 degrees, dark and raining and between March and May. Become a volunteer amphibian crossing reporter and help anphibians cross the road.",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "This helps amphibians cross roads safely when they migrate",

    // STUDENTS: Which survey interests match this tip?
    // Use the same words as the survey answer choices.
    interests: [
      "interest1",
      "interest2",
      "interest3",
    ],

    // STUDENTS: Does the user need a lawn?
    // Change to true if yes.
    requiresLawn: false,

    // STUDENTS: Does the user need a garden?
    // Change to true if yes.
    requiresGarden: false,

    // STUDENTS: Which months should this tip appear?
    // January = 1, February = 2 ... December = 12
    months: [3, 4, 5, 11] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  
    // STUDENTS: Link this recommendation to an animal or plant.

  learnMore: {
    type: "animal",
    id: "little-brown-bat",
    label: "Learn more about ...",
  },
  },

  // RECOMMENDATION 6
  {
    id: 6,

    // STUDENTS: Give your recommendation a title.
    title: "Attract American Goldfinches to your yard ",

    // STUDENTS: Explain what the user should do.
    description: "It is easy to attract American Goldfinches to your bird feeder with the right seeds: thistle, sunflower or nyjer. Put the seeds in an upright tube feeder that allows them to feed upright and upside down like they are used to when feeding from a plant. ",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "This helps the American Goldfinch get food for winter and gives you glimpses of the state bird for multiple states!",

    // STUDENTS: Which survey interests match this tip?
    // Use the same words as the survey answer choices.
    interests: [
      "interest1",
      "interest2",
      "interest3",
    ],

    // STUDENTS: Does the user need a lawn?
    // Change to true if yes.
    requiresLawn: false,

    // STUDENTS: Does the user need a garden?
    // Change to true if yes.
    requiresGarden: false,

    // STUDENTS: Which months should this tip appear?
    // January = 1, February = 2 ... December = 12
    months: [7, 8] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  
    // STUDENTS: Link this recommendation to an animal or plant.

  learnMore: {
    type: "animal",
    id: "american goldfinch",
    label: "Learn more about the American Goldfinch",
  },
  },

  // RECOMMENDATION 7
  {
    id: 7,

    // STUDENTS: Give your recommendation a title.
    title: "What to plant to help American Goldfinches ",

    // STUDENTS: Explain what the user should do.
    description: "You can plant native thistle and/or milkweed in your yard. They will eat the seeds of these plants in July and August. Also, they also use these plants to make their nests along with other materials. ",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "This helps the American Goldfinch get food and materials to build nests!",

    // STUDENTS: Which survey interests match this tip?
    // Use the same words as the survey answer choices.
    interests: [
      "interest1",
      "interest2",
      "interest3",
    ],

    // STUDENTS: Does the user need a lawn?
    // Change to true if yes.
    requiresLawn: false,

    // STUDENTS: Does the user need a garden?
    // Change to true if yes.
    requiresGarden: true,

    // STUDENTS: Which months should this tip appear?
    // January = 1, February = 2 ... December = 12
    months: [10] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  
    // STUDENTS: Link this recommendation to an animal or plant.

  
learnMoreLinks: [
  {
    type: "animal",
    id: "american-goldfinch",
    label: "Learn more about the American Goldfinch",
  },
  {
    type: "plant",
    id: "milkweed",
    label: "Learn more about Milkweed",
  },
],
},


  // ============================================================
  // RECOMMENDATIONS 8–17
  // ============================================================
  // STUDENTS:
  // 1. Write a title and description.
  // 2. Explain why the activity helps biodiversity.
  // 3. Add the months when the activity is relevant.
  // 4. Add your sources and optional Learn More links.
  //
  // Leave unused recommendations blank.
  // Blank recommendations will not appear on the dashboard.
  // Do not change the ID numbers.
  // ============================================================

  // RECOMMENDATION 8
  {
    id: 8,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 9
  {
    id: 9,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 10
  {
    id: 10,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 11
  {
    id: 11,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 12
  {
    id: 12,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 13
  {
    id: 13,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 14
  {
    id: 14,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 15
  {
    id: 15,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 16
  {
    id: 16,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },

  // RECOMMENDATION 17
  {
    id: 17,
    title: "",
    description: "",
    whyItMatters: "",
    interests: [],
    requiresLawn: false,
    requiresGarden: false,
    months: [] as number[],
    source: "",
    sources: [
      { name: "", url: "" },
    ],
    learnMoreLinks: [],
  },



  
];


// ============================================================
// ANIMAL CATEGORIES
// ============================================================
//
// STUDENTS: This section is for your Animals page!
//
// HOW TO FILL THIS OUT:
// 1. Find the words "REPLACE THIS TEXT".
// 2. Replace them with your own writing.
// 3. Keep your answers inside the quotation marks.
// 4. Keep the commas at the end of each line.
//
// ============================================================


export const animalCategories = [
  {
    title: "Mammals",
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },
  {
    title: "Fish",
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },
  {
    title: "Reptiles",
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },
  {
    title: "Amphibians",
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },
  {
    title: "Birds",
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },
  {
    title: "Insects",
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },
];


// ============================================================
// INDIVIDUAL ANIMALS
// ============================================================
//
// STUDENTS: Add animals you want to feature.
//
// Choose one of these category IDs:
// - mammals
// - fish
// - reptiles
// - amphibians
// - birds
// - insects
//
// ============================================================

export const individualAnimals = [
  
  // ==========================================================
  // BEAVER
  // ==========================================================

  {
    id: "beaver",
    category: "mammals",
    name: "Beaver",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },

  // ==========================================================
  // BLACK BEAR
  // ==========================================================

  {
    id: "black-bear",
    category: "mammals",
    name: "Black Bear",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },

  {
    id: "little-brown-bat",
    category: "mammals",
    name: "Little Brown Bat",
    description: "Bats are the only mammals that fly. They live in buildings, in tree hollows and under peeling bark. They can eat up to half their weight in insects each night during the summer. This bat’s population in Vermont has been reduced by 90% by the white-nosed-syndrome, a fungal infection and is listed by Vermont as endangered.",
    importance: "They eat insects that harm crops and carry diseases. Farmers can use less pest control if they have bats helping. They reduce the number of insects bothering you when you are outside like mosquitoes.",
    conservationTip: "",

  // STUDENTS: Add clickable research sources here.
  // "name" is what visitors see.
  // "url" is where the link takes them.

  source: "",

  sources: [
    {
      name: "Vermont Fish & Wildlife Department",
      url: "https://www.vtfishandwildlife.com/learn-more/vermont-critters/mammals/little-brown-bat",
    },
    {
      name: "VTDigger",
      url: "https://vtdigger.org/2026/10/20/vermont-experts-say-bats-need-our-help-how-do-we-get-over-our-fear-of-them/",
    },
    {
      name: "Seven Days",
      url: "https://www.sevendaysvt.com/arts-culture/work-barry-and-maureen-genzlinger-rescue-bats-10444077/",
    },
  ],

    image: "",
  },
  {
    id: "animal-2",
    category: "fish",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },
  {
    id: "animal-3",
    category: "reptiles",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },
  {
    id: "animal-4",
    category: "amphibians",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },
  {
    id: "american goldfinch",
    category: "birds",
    name: "American Goldfinch",
    description: "The American Goldfinch lives in Vermont year-round. In the spring and summer, males are bright yellow with black on their head and wings and the females are yellowish green. In the winter, they turn brown. They are almost entirely vegetarian. Their favorite seed is from thistle plants. They use grass, bark, milkweed, thistle, cattail down and spider webs to weave their nests. They nest in July and August when there are a lot of thistles seeds. One of their calls is po-ta-to-chip ",
    importance: "Similar to other songbirds, there are fewer American Goldfinches than there used to be. Because they eat several types of seeds, if you see a lot of these birds, it is a sign of a healthy and diverse plant community. ",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  
sources: [
  {
    name: "Audubon Ten Fun Facts About the American Goldfinch",
    url: "https://www.audubon.org/magazine/10-fun-facts-about-american-goldfinch",
  },
  {
    name: "Fish & Wildlife American Goldfinch",
    url: "https://www.vtfishandwildlife.com/learn-more/vermont-critters/birds/american-goldfinch",
  },
  {
    name: "Native Field Thistle",
    url: "https://plants.sc.egov.usda.gov/DocumentLibrary/factsheet/pdf/fs_cidi.pdf",
  },
],


    image: "https://live.staticflickr.com/7406/9164872669_ce57df16c6_b.jpg",
  },
  {
    id: "animal-6",
    category: "insects",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },
];


// ============================================================
// SECTION 5: PLANTS & GARDENS
// ============================================================
//
// STUDENTS: This section is for your Plants & Gardens page!
//
// HOW TO FILL THIS OUT:
// 1. Find the words "REPLACE THIS TEXT".
// 2. Delete those words.
// 3. Type your answer INSIDE the quotation marks.
// 4. Keep the quotation marks (" ") and commas (,).
//
// You can also send your answers to Ryan to add to the website.
//
// ============================================================

export const plantCategories = [

  // ==========================================================
  // CATEGORY 1: POLLINATOR GARDEN PLANTS
  // ==========================================================

  {
    // STUDENTS: This is the name of your category.
    // You can change it if you want!
    title: "Pollinator Garden Plants",

    // QUESTION 1:
    // What should visitors know about this category?
    // WRITE YOUR ANSWER BELOW:
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",

    // QUESTION 2:
    // What can people do to help biodiversity?
    // WRITE YOUR ANSWER BELOW:
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },

  // ==========================================================
  // CATEGORY 2: HELPFUL PLANTS
  // ==========================================================

  {
    // STUDENTS: You can rename this category.
    title: "Helpful Plants",

    // QUESTION 1:
    // What should visitors know about this category?
    // WRITE YOUR ANSWER BELOW:
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",

    // QUESTION 2:
    // What can people do to help biodiversity?
    // WRITE YOUR ANSWER BELOW:
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },

  // ==========================================================
  // CATEGORY 3: TREES
  // ==========================================================

  {
    // STUDENTS: You can rename this category.
    title: "Trees",

    // QUESTION 1:
    // What should visitors know about this category?
    // WRITE YOUR ANSWER BELOW:
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",

    // QUESTION 2:
    // What can people do to help biodiversity?
    // WRITE YOUR ANSWER BELOW:
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },

  // ==========================================================
  // CATEGORY 4: WILDLIFE PLANTS
  // ==========================================================

  {
    // STUDENTS: You can rename this category.
    title: "Wildlife Plants",

    // QUESTION 1:
    // What should visitors know about this category?
    // WRITE YOUR ANSWER BELOW:
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",

    // QUESTION 2:
    // What can people do to help biodiversity?
    // WRITE YOUR ANSWER BELOW:
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },

];


// ==================================================
// SECTION 6: WILDLIFE CAMERA
// ==================================================

/*
STUDENTS:

Your original idea includes wildlife
photos and videos!

Choose what you would like to show.

We can add actual images and videos later.
*/

// ============================================================
// SECTION 6: WILDLIFE CAM
// ============================================================
//
// STUDENTS: This section is for your Wildlife Cam page!
//
// HOW TO FILL THIS OUT:
// 1. Find the words "REPLACE THIS TEXT".
// 2. Replace them with your own writing.
// 3. Keep your answers inside the quotation marks.
// 4. Keep the commas at the end of each line.
//
// You can also send your answers and pictures to Ryan.
//
// ============================================================

export const wildlifeContent = [

  // ==========================================================
  // WILDLIFE ENTRY 1
  // ==========================================================

  {
    // QUESTION 1:
    // What should this wildlife photo or camera be called?
    // WRITE YOUR ANSWER BELOW:
    title: "REPLACE THIS TEXT WITH YOUR TITLE",

    // QUESTION 2:
    // What should visitors know about what they're seeing?
    // WRITE YOUR ANSWER BELOW:
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",

    // QUESTION 3:
    // Where did you get the information or image?
    // WRITE YOUR ANSWER BELOW:
    source: "REPLACE THIS TEXT WITH YOUR SOURCE",

    // IMAGE:
    // Ryan will add the image file after you choose it.
    // Leave this blank for now.
    image: "",
  },

  // ==========================================================
  // WILDLIFE ENTRY 2
  // ==========================================================

  {
    // QUESTION 1:
    // What should this wildlife photo or camera be called?
    // WRITE YOUR ANSWER BELOW:
    title: "REPLACE THIS TEXT WITH YOUR TITLE",

    // QUESTION 2:
    // What should visitors know about what they're seeing?
    // WRITE YOUR ANSWER BELOW:
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",

    // QUESTION 3:
    // Where did you get the information or image?
    // WRITE YOUR ANSWER BELOW:
    source: "REPLACE THIS TEXT WITH YOUR SOURCE",

    // IMAGE:
    // Ryan will add the image file after you choose it.
    image: "",
  },

];


/*
==========================================
INDIVIDUAL PLANTS
==========================================

STUDENT INSTRUCTIONS:

Add plants that you want to feature in
each Plants & Gardens category.

For each plant, fill in:
- Name
- Description
- Why it matters
- Conservation tip
- Research source

Choose one of these category IDs:
- pollinators
- helpful
- trees
- wildlife

Ask the developer for help adding more
entries or uploading photographs.
*/

export const individualPlants = [
  {
    id: "plant-1",
    category: "pollinators",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },
  {
    id: "plant-2",
    category: "helpful",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },
  {
    id: "milkweed",
    category: "trees",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },
  {
    id: "plant-4",
    category: "wildlife",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },

  {
    id: "plant-5",
    category: "rewilding",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    
  // STUDENTS: Add the names and website links for your sources.
  // "name" is what visitors click on.
  // "url" is the website they will visit.
  // Leave blank until you have researched your sources.

  source: "",

  sources: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],

    image: "",
  },



  // ==========================================================
  // CATEGORY 5: REWILDING THE LAWN
  // ==========================================================

  {
    // STUDENTS: You can rename this category.
    title: "Rewilding the Lawn",

    // QUESTION 1:
    // What does rewilding a lawn mean?
    // How can it help Vermont biodiversity?
    description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",

    // QUESTION 2:
    // What can people do to make their lawns
    // more wildlife-friendly?
    conservationTip: "REPLACE THIS TEXT WITH YOUR TIP",
  },

];

