# FreshHire - Feature Documentation

## Overview

FreshHire is an AI-powered job board designed for students, fresh graduates, and early-career professionals. This document explains every feature available in the application, its purpose, user flow, and implementation details.

---

# 1. Home Page

## Purpose

The Home page provides users with a quick overview of available jobs, featured companies, AI-powered recommendations, and navigation to the platform.

## Features

- **Hero Section**: Taglines and CTAs to search jobs or upload a resume.
- **Search Bar**: Dual-input fields for keywords and location queries.
- **Featured Jobs**: Dynamic list displaying recommended jobs.
- **Featured Companies**: Cards showing active hiring organizations.
- **Quick Stats Card**: Displays live bookmark counts, pending applications, and scheduled interview counts.
- **AI Highlights**: Matching alerts and evaluation cards.
- **Responsive Navigation**: Sticky navbar with light/dark theme toggles, notification dropdowns, and a mobile drawer.

## User Flow

1. User opens FreshHire.
2. Views statistics, recommendations, and recent job reviews.
3. Searches for jobs and applies quick filters.
4. Clicks a job card or selects cards for comparison.

---

# 2. Smart Job Search

## Purpose

Help users quickly discover jobs using keywords and location.

## Features

- **Keyword Search**: Matches job titles, companies, and tech tags.
- **Location Search**: Filters jobs based on city name or remote keywords.
- **Instant Filtering**: Automatically updates the list of active job cards as the user types.

## Implementation

Uses React state hooks (`searchQuery` and `locationQuery`) to dynamically filter listings using client-side JavaScript.

---

# 3. Filter System

## Available Filters

- **Fresher Friendly**: Shows jobs requiring entry-level experience.
- **Remote**: Shows work-from-home positions.
- **Hyderabad**: Shows local roles based in Hyderabad.
- **Frontend**: Filters for developer and UI/UX design positions.
- **Backend**: Filters for server-side positions.
- **Data**: Filters for data science, analysis, and python roles.

*(Note: Other mock filters have been removed as only these six are active in the application logic).*

## User Experience

Filters update results instantly without page refresh, managed through the active chips state array.

---

# 4. Job Cards

Each job card displays:

- **Company Logo & Initials**: Styled with company-specific background colors.
- **Company Name**: Identifies the hiring employer.
- **Job Title**: The professional designation.
- **Salary**: The compensation range.
- **Experience**: Required background tag.
- **Location**: Workplace city or remote status.
- **AI Match Score**: Visual percentage badge of candidate fit.
- **Bookmark Button**: Saves the job to LocalStorage.
- **Compare Checkbox**: Selects the job for side-by-side comparison.
- **Details Link**: Visual button triggering job details alerts.

---

# 5. AI Match Score

## Purpose

Estimate how well a job matches the user's profile.

## How It Works

A baseline compatibility score (configured inside the mock job data) is mapped to each card. This score dynamically recalculates when a candidate uploads a resume.

---

# 6. Resume Match

## Purpose

Allow users to compare their resume against a job description.

## Workflow

1. User drops a resume file or clicks the upload container.
2. An animated progress bar counts from 0% to 100%.
3. Upon upload completion, a success toast triggers.
4. The AI Match scores on the job cards increase dynamically based on skill tags (up to a 99% cap).

---

# 7. AI Job Summary

## Purpose

Summarize lengthy job descriptions into concise insights.

## Output

- **Key Skills**: Necessary technologies.
- **Responsibilities**: Core duties of the role.
- **Estimated Salary**: Market values.
- **Red Flags**: Warnings regarding legacy code migration or fast timelines.

---

# 8. AI Cover Letter Generator

## Purpose

Generate personalized cover letters.

## User Flow

1. Select a job card.
2. Launch the Cover Letter Generator tool.
3. Click generate to customize a template with the candidate's active name, title, and target company.
4. Copy the generated letter to the clipboard.

---

# 9. AI Interview Questions

## Purpose

Prepare candidates for interviews.

## Categories

- **Technical**: Technical questions tailored to job stack tags.
- **HR & Behavioral**: Cultural alignment and motivational interview questions.

---

# 10. Saved Jobs

## Purpose

Allow users to bookmark jobs.

## Storage

Bookmarks are stored in browser LocalStorage. Checked saved items can be compared side-by-side using the comparison drawer.

---

# 11. Profile

Users can manage:

- **Name**: Main candidate identifier.
- **Target Role**: Target professional title.
- **Preferred Location**: Candidate headquarters.
- **Career Preferences**: Skills list and job readiness ratings.

Changes are edited via a modal form and persistent inside LocalStorage.

---

# 12. Settings

Includes:

- **Dark Mode**: Theme toggles.
- **Notification Preferences**: Checkboxes for email alerts, recruiter messages, and weekly digests.
- **Email Alerts**: Sync toggle.
- **Weekly Updates**: Tech trends signup.

All preferences persist inside browser LocalStorage.

---

# 13. Companies

Displays:

- **Company Cards**: Amazon, Google, Netflix, and Meta.
- **Hiring Status**: Active indicators.
- **Open Positions**: Live roles count.
- **Company Details**: Headquarters and employee ratings.

---

# 14. Dark Mode

Supports:

- **Light Theme**: Bright interfaces.
- **Dark Theme**: Indigo and slate dark interface.
- **Theme Persistence**: Synced with root HTML class and stored in LocalStorage.

---

# 15. Responsive Design

FreshHire is optimized for:

- **Desktop & Laptop**: Dual-column details and sidebar grids.
- **Tablet**: Collapsed layouts.
- **Mobile**: Single-column job scrolling and hamburger menus.

---

# 16. Accessibility

The application follows accessibility best practices including:

- **Semantic HTML**: Navigation landmarks, header, and main divisions.
- **Keyboard-friendly Navigation**: Highlight outlines on interactive controls.
- **Accessible Color Contrast**: Compliant text contrast ratios.
- **ARIA Labels**: Labels on theme toggle and notifications controls.

---

# 17. Deployment

- **GitHub Repository**: Pushed and version-controlled.
- **Vercel Deployment**: Live application at `fresh-hire-steel.vercel.app`.
- **GitHub Actions CI Pipeline**: Automated build validation workflow.

---

# Future Enhancements

- **Authentication**: Secured user registration.
- **Resume Parser**: Direct PDF text extraction.
- **ATS Tracking**: Application tracking board.
- **Real AI APIs**: Integrations with live Gemini/OpenAI API keys.
- **Backend Integration**: Databases and server structures.
- **Employer Dashboard**: Roles management for recruiters.
