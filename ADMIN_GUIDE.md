# Vermont Biodiversity — Administrator Guide

## Overview

The Vermont Biodiversity website was developed for the LEGO Club to explore local biodiversity, share wildlife observations, and contribute educational content.

Administrators help manage user-submitted wildlife sightings and ensure that content is appropriate before it appears publicly.

## 1. Administrator Accounts

The website supports two types of users:

**Regular Users**
- Create an account and log in.
- Complete the biodiversity survey.
- Explore the dashboard and educational resources.
- Submit wildlife sightings and photographs.
- View approved wildlife sightings.

**Administrators**
- Have access to all regular user features.
- Can access the administrator dashboard.
- Can review submitted wildlife sightings and photographs.
- Can approve or reject submissions.

## 2. Creating an Administrator Account

1. Navigate to `/admin/signup`.
2. Enter an email address and password.
3. Enter the administrator signup code provided by the teacher.
4. Select **Create Admin Account**.
5. Follow any account confirmation instructions.

**Important:** The administrator signup code should only be shared with authorized students, teachers, or other designated administrators.

Do not include the actual administrator code in this document or commit it to GitHub.

## 3. Logging In

1. Navigate to `/login`.
2. Enter your account credentials.
3. Sign in to access the biodiversity survey and dashboard.
4. Administrators can navigate to `/admin` to manage submissions.

## 4. Reviewing Wildlife Sightings

When a visitor submits a wildlife sighting, it is saved with a `pending` status.

To review a submission:

1. Open `/admin`.
2. Review the animal or plant name, description, observation date, and approximate location.
3. Review the photograph if one was submitted.
4. Select **Approve** or **Reject**.

Approved submissions appear in the public Wildlife Gallery at `/gallery`.

Rejected submissions do not appear publicly.

## 5. Content and Privacy Guidelines

Administrators should check that submissions:

- Relate to wildlife, plants, or biodiversity.
- Do not contain inappropriate content.
- Do not reveal personal information, such as home addresses, phone numbers, or student names.
- Do not contain identifiable photographs of children or other people.
- Use approximate locations rather than exact addresses.

If a submission does not meet these guidelines, reject it.

## 6. Administrator Permissions and Security

Administrator access is controlled through Supabase authentication and the `admin_users` database table.

Only verified administrators can use the protected moderation API.

Regular accounts do not automatically receive administrator privileges.

Administrators should keep their passwords private and avoid sharing accounts.

## 7. Current Development Status

The following features have been implemented and tested locally:

- User authentication
- Administrator registration
- Wildlife sighting submissions
- Photograph uploads
- Administrator approval and rejection
- Public gallery of approved sightings

Before public launch, production security testing and privacy safeguards must be finalized.

## 8. Support and Maintenance

If an administrator experiences an issue, they should contact the website developer or supervising teacher.

Changes to administrator permissions or the website's security settings should be handled by an authorized maintainer.
