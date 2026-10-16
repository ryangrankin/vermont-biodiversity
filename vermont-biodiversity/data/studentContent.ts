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
  name: "replace this text with your apps name",

  // STUDENTS: Write a short slogan for your app.
  tagline: "replace this text with your apps slogan",

  // STUDENTS: Write a welcome message explaining
  // what your app does and why it matters.
  welcome: "replace this text with your welcome message",

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
  introduction: "write why users should complete survey here",
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
    question: "replace this text with your question about lawns",

    options: [
      "replace this text with choice 1", // STUDENTS: First answer choice
      "replace this text with choice 2", // STUDENTS: Second answer choice
    ],
  },

  // QUESTION 3: GARDEN
  {
    id: "garden",

    // STUDENTS: Write your question about gardens.
    question: "replace this text with your question about gardens",

    options: [
      "replace this text with choice 1",
      "replace this text with choice 2",
    ],
  },

  // QUESTION 4: PETS
  {
    id: "pets",

    // STUDENTS: Write your question about pets.
    question: "replace this text with your question about pets",

    options: [
      "replace this text with choice 1",
      "replace this text with choice 2",
    ],
  },

  // QUESTION 5: OUTDOOR INTERESTS
  {
    id: "interests",

    // STUDENTS: Ask users what activities they enjoy.
    question: "replace this text with your questions about activities",

    // STUDENTS: Add activities people can choose.
    options: [
      "replace this text with choice 1",
      "replace this text with choice 2",
      "replace this text with choice 3",
      "replace this text with choice 4",
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
    title: "Black Bears and Birdfeeders Don't Mix",

    // STUDENTS: Explain what the user should do.
    description: "Take in your bird feeder April through December to not attract bears",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "replace this text with your explanation",

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
    months: [] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  },

  // RECOMMENDATION 2
  {
    id: 2,

    // STUDENTS: Give your recommendation a title.
    title: "replace this text with your title",

    // STUDENTS: Explain what the user should do.
    description: "replace this text with your instructions",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "replace this text with your explanation",

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
    months: [] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  },

  // RECOMMENDATION 3
  {
    id: 3,

    // STUDENTS: Give your recommendation a title.
    title: "replace this text with your answer",

    // STUDENTS: Explain what the user should do.
    description: "replace this text with your answer",

    // STUDENTS: Explain why this helps biodiversity.
    whyItMatters: "replace this text with your answer",

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
    months: [] as number[],

    // STUDENTS: Where did you find this information?
    source: "replace this text with your source url",
  },

];


// ==================================================
// SECTION 4: ANIMALS PAGE
// ==================================================

/*
STUDENTS:

Choose which Vermont animals you want
to feature in your app.

For each animal, write:
- Its name
- Information about the animal
- Why it matters to Vermont's ecosystem
- How people can help protect it
*/

export const animals = [

  // ANIMAL 1
  {
    name: "Beaver",

    // STUDENTS: Write about this animal.
    description: "replace this text with your animal description",

    // STUDENTS: Why is this animal important?
    importance: "replace this text with your answer",

    // STUDENTS: How can people help?
    conservationTip: "replace this text with your answer",

    // STUDENTS: Add a source for your information.
    source: "replace this text with your source url",
  },

  // ANIMAL 2
    {
    name: "replace this text with your answer",

    // STUDENTS: Write about this animal.
    description: "replace this text with your 2nd animal",

    // STUDENTS: Why is this animal important?
    importance: "replace this text with your answer",

    // STUDENTS: How can people help?
    conservationTip: "replace this text with your answer",

    // STUDENTS: Add a source for your information.
    source: "replace this text with your source url",
  },

];


// ==================================================
// SECTION 5: PLANTS AND GARDENS PAGE
// ==================================================

/*
STUDENTS:

These four categories come from your
original app drawings!

Write information for each category.
*/

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
