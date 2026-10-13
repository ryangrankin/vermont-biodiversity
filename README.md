# Vermont Biodiversity App
## Editing Guide for LEGO Club Students and Teachers

Welcome to the Vermont Biodiversity App!

This website was created to bring the LEGO Club's biodiversity project to life. Students are responsible for researching, writing, and choosing what information appears on the website.

This guide explains how teachers and students can update the website using GitHub.

**You do not need to know how to code to make basic content changes!**

---

# 1. Opening the Website Files

### Step 1: Sign in to GitHub

1. Go to https://github.com
2. Sign in to your GitHub account.
3. Open the repository: `ryangrankin/vermont-biodiversity`

### Step 2: Find the Content File

Most of the information displayed on the website is stored in one file.

1. Open the `src` folder, if present.
2. Open the `data` folder.
3. Click `studentContent.ts`.

The file should be located at:

`src/data/studentContent.ts`

If your repository does not have a `src` folder, look for:

`data/studentContent.ts`

**This is the main file you will edit.**

You should not need to change any other files to update the website's written content.

---

# 2. How to Edit the File

### Step 1: Open Editing Mode

1. Open `studentContent.ts`.
2. Click the pencil icon in the upper-right corner.
3. You can now edit the file directly in your browser.

### Step 2: Find the Section You Want to Update

The file contains several sections:

| Section | What It Controls |
|---------|------------------|
| `appInfo` | Website name and welcome message |
| `surveyContent` | Survey introduction |
| `surveyQuestions` | Survey questions and answer choices |
| `recommendations` | Biodiversity activities and tips |
| `animals` | Animal information |
| `plantCategories` | Plants and garden information |
| `wildlifeContent` | Wildlife Cam information |

You can edit one section at a time.

---

# 3. Important Editing Rules

The file contains code that tells the website where to display information.

**Only change the placeholder text unless you have been instructed otherwise.**

For example:

### BEFORE

```typescript
{
  name: "REPLACE THIS TEXT WITH ANIMAL NAME",
  description: "REPLACE THIS TEXT WITH YOUR DESCRIPTION",
}
```

### AFTER

```typescript
{
  name: "Our Chosen Animal",
  description: "Our research about this animal goes here.",
}
```

### DO:

- Replace placeholder text with your writing.
- Keep your writing inside quotation marks.
- Keep commas at the ends of lines.
- Include sources for your research.
- Save your work when finished.

### DO NOT:

- Delete quotation marks.
- Delete commas.
- Delete brackets `{ }` or `[ ]`.
- Change words such as `name:`, `description:`, or `source:`.
- Delete sections of code.
- Change files outside `studentContent.ts` without help.

**Important:** If your writing contains quotation marks, backslashes, or multiple lines, ask the developer for help formatting it correctly.

---

# 4. Editing the Website Information

Find this section:

```typescript
export const appInfo = {
```

This section controls the information visitors see when they first open the website.

Students can decide:

1. What should the app be called?
2. What should its slogan be?
3. What welcome message should visitors see?

Replace the placeholder text with the students' chosen wording.

---

# 5. Editing the Survey

Find:

```typescript
export const surveyQuestions = [
```

The survey helps the app understand what types of biodiversity recommendations may be useful to visitors.

The current survey includes questions about:

- Location
- Lawn ownership
- Garden ownership
- Pets
- Outdoor interests

### Editing a Question

You will see code similar to:

```typescript
{
  id: "pets",
  question: "REPLACE THIS TEXT WITH YOUR QUESTION",
  options: [
    "REPLACE THIS TEXT WITH CHOICE 1",
    "REPLACE THIS TEXT WITH CHOICE 2",
  ],
}
```

To edit:

1. Find the question you want to change.
2. Replace the placeholder question with your own wording.
3. Replace the placeholder answer choices.
4. Keep the quotation marks, commas, and brackets.

**Do not change the `id` field.**

The developer will help connect the final survey answers to the recommendation system.

---

# 6. Adding Biodiversity Recommendations

Find:

```typescript
export const recommendations = [
```

This section contains actions visitors can take to support biodiversity.

For each recommendation, students should research and write:

1. **Title:** What is the activity called?
2. **Description:** What should the visitor do?
3. **Why It Matters:** How does this help biodiversity?
4. **Source:** Where did the information come from?

### Example

```typescript
{
  title: "Our Activity Title",
  description: "Instructions written by students.",
  whyItMatters: "Why this activity helps biodiversity.",
  source: "Our research source.",
}
```

This is an example of the content fields, not a complete recommendation entry.

**Important:** Do not delete or change other fields in the recommendation, including:

- `id`
- `months`
- `interests`
- `requiresLawn`
- `requiresGarden`

These fields help the app decide which recommendations to show users.

The developer will configure these settings after students have completed their recommendations and survey choices.

---

# 7. Adding Animal Information

Find:

```typescript
export const animals = [
```

Each animal entry contains information about a species chosen by the students.

Students should answer:

1. What animal are we featuring?
2. What should visitors know about it?
3. Why is it important to Vermont's biodiversity?
4. What can people do to help protect it?
5. Where did we find this information?

### Example

```typescript
{
  name: "Our Chosen Animal",
  description: "Our description of this animal.",
  importance: "Why this animal matters.",
  conservationTip: "How people can help.",
  source: "Our research source.",
}
```

Replace the placeholder writing in the existing entries.

Do not remove any other fields already present.

---

# 8. Editing Plants & Gardens

Find:

```typescript
export const plantCategories = [
```

The app currently includes four categories:

1. Pollinator Garden Plants
2. Helpful Plants
3. Trees
4. Wildlife Plants

Each category has space for:

- A category name
- A description
- A conservation tip

### How to Edit

1. Find the category you want to work on.
2. Replace the description placeholder with student-written information.
3. Replace the conservation tip placeholder.
4. Include research sources where the existing file provides a source field.
5. Save your changes.

Students can decide whether they want to keep or change the category names.

---

# 9. Editing the Wildlife Cam

Find:

```typescript
export const wildlifeContent = [
```

This section provides space for wildlife photographs and descriptions.

Students can choose:

- Which wildlife to feature
- What information to include
- Which photographs or images to use
- Which sources to reference

### Editing Wildlife Information

Replace the existing placeholders for:

- `title`
- `description`
- `source`

**Leave the image path unchanged for now.**

Students should choose their images and send them to the teacher or developer.

The developer will help upload the images and connect them to the website.

Only use photographs or images that the club has permission to publish.

---

# 10. Saving Your Changes

When you finish editing, you need to save your work through GitHub.

### Step 1: Commit Your Changes

1. Click **Commit changes**.
2. Enter a short description of your edits.

Examples:

- `Added animal descriptions`
- `Updated survey questions`
- `Added plant information`
- `Updated wildlife content`

### Step 2: Submit Changes for Review

If GitHub gives you the option:

1. Select **Create a new branch for this commit and start a pull request**.
2. Click **Propose changes**.
3. Follow the instructions to create a pull request.

This allows the developer to review the changes before they appear on the live website.

If GitHub does not offer this option, contact the developer before committing directly to the main branch.

---

# 11. Viewing Your Changes on the Website

After the developer approves and merges the changes:

1. GitHub updates the project.
2. Vercel starts building the updated website.
3. If the build succeeds, the changes are published.
4. Open the website to check your work.

**Website link:** [INSERT WEBSITE LINK]

It may take a few minutes for changes to appear.

### Check That:

- Your writing appears in the correct section.
- Nothing is missing.
- The text is readable.
- The page looks correct.

If something looks wrong, contact the developer.

---

# 12. What If Something Goes Wrong?

GitHub keeps a history of changes, so previous versions can be reviewed.

If you accidentally change something or see an error:

1. Stop editing.
2. Do not delete additional code to try to fix it.
3. Contact the developer.
4. Explain which section you were working on.
5. Include a screenshot of the problem if possible.

**You do not need to fix technical errors yourself.**

---

# 13. Recommended Club Workflow

To make the process easy for students and teachers:

### Students

1. Research a biodiversity topic.
2. Write their information.
3. Record their sources.
4. Choose any images they want to include.
5. Review their writing with a teacher.

### Teachers

1. Review student-written content.
2. Open `studentContent.ts` on GitHub.
3. Copy the approved writing into the appropriate section.
4. Submit a pull request.
5. Contact the developer if technical help is needed.

### Developer

1. Review submitted changes.
2. Fix any formatting or code issues.
3. Merge approved changes.
4. Confirm the website deploys successfully.
5. Help students and teachers with technical questions.

---

# 14. Final Checklist

Before submitting your changes:

- [ ] We edited the correct section.
- [ ] Our writing is inside quotation marks.
- [ ] We kept the commas and brackets.
- [ ] We included our research sources.
- [ ] We did not change unrelated code.
- [ ] We described our changes in GitHub.
- [ ] We submitted our work for review.

---

# Need Help?

If you have questions or encounter an error, contact the developer.

**Developer:** Ryan Rankin

**GitHub Repository:** https://github.com/ryangrankin/vermont-biodiversity

**Website:** [INSERT WEBSITE LINK]

---

**This is the LEGO Club's project.**

Students are responsible for the research, writing, ideas, and creative decisions.
