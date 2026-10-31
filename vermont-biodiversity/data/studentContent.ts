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
  tagline: "replace this text with your apps slogan",

  // STUDENTS: Write a welcome message explaining
  // what your app does and why it matters.
  welcome: "Sign in to explore Vermont wildlife, complete your biodiversity survey and get your personalized recommendations for helping to protect Vermont's natural environment",

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
    source: "",
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
    source: "",
    image: "",
  },

  {
    id: "little-brown-bat",
    category: "mammals",
    name: "Little Brown Bat",
    description: "Bats are the only mammals that fly. They live in buildings, in tree hollows and under peeling bark. They can eat up to half their weight in insects each night during the summer. This bat’s population in Vermont has been reduced by 90% by the white-nosed-syndrome, a fungal infection and is listed by Vermont as endangered.",
    importance: "They eat insects that harm crops and carry diseases. Farmers can use less pest control if they have bats helping. They reduce the number of insects bothering you when you are outside like mosquitoes.",
    conservationTip: "",
    source: "https://www.vtfishandwildlife.com/learn-more/vermont-critters/mammals/little-brown-bat https://vtdigger.org/2026/10/20/vermont-experts-say-bats-need-our-help-how-do-we-get-over-our-fear-of-them/https://www.sevendaysvt.com/arts-culture/work-barry-and-maureen-genzlinger-rescue-bats-10444077/",
    image: "",
  },
  {
    id: "animal-2",
    category: "fish",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
    image: "",
  },
  {
    id: "animal-3",
    category: "reptiles",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
    image: "",
  },
  {
    id: "animal-4",
    category: "amphibians",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
    image: "",
  },
  {
    id: "animal-5",
    category: "birds",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
    image: "",
  },
  {
    id: "animal-6",
    category: "insects",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
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
    source: "",
    image: "",
  },
  {
    id: "plant-2",
    category: "helpful",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
    image: "",
  },
  {
    id: "plant-3",
    category: "trees",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
    image: "",
  },
  {
    id: "plant-4",
    category: "wildlife",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
    image: "",
  },

  {
    id: "plant-5",
    category: "rewilding",
    name: "",
    description: "",
    importance: "",
    conservationTip: "",
    source: "",
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

