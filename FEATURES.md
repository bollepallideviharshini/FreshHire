# FreshHire - Feature Documentation

## Overview

**FreshHire** is an AI-powered, high-fidelity job board and application accelerator designed specifically for students, fresh graduates, and early-career developers. Built using a modern stack (React 19, Vite, TypeScript, and Tailwind CSS v4), the application functions as a robust client-side Single Page Application (SPA). 

This document details every feature available on the platform, explaining its **Purpose**, **User Experience & Flow**, and **Technical Implementation Details** to help developers and users understand how the system operates under the hood.

---

# 1. Navigation & Theme Engine

## Purpose
Provides a responsive header layout to navigate between core features, check system alerts, manage preferences, and swap color schemes.

## Features
*   **Sticky Header**: Uses backdrop blurs (`backdrop-blur-nav` utilizing native Webkit support) to stay pinned to the top of the viewport during scroll.
*   **Dark/Light Mode**: Offers a seamless dark mode toggle that synchronizes with the operating system's default preference and saves the selection for future visits.
*   **Notifications Panel**: A dropdown alerting users of profile compatibility recommendations (e.g., matching notifications from companies like Vercel or Stripe).
*   **Profile Menu**: Quick links to candidate details and notifications config.

## User Flow
1. The user hovers over the navigation links (Home, Jobs, Companies, Saved Jobs, Profile, Settings) to navigate between sections.
2. Clicking the **Sun/Moon** button in the header instantly toggles the theme.
3. Clicking the **Bell** icon expands a dropdown displaying notifications.

## Implementation Details
*   **Theme Sync**: Managed via the `darkMode` state, initialized by reading `localStorage.getItem('theme')` or evaluating `window.matchMedia('(prefers-color-scheme: dark)').matches`. Swapping themes adds or removes the `.dark` class from the `document.documentElement` element.
*   **Local Storage Key**: `theme` (values: `'dark'` or `'light'`).

---

# 2. Hero Section & Stats

## Purpose
Captures the user's attention, presents the value proposition, and establishes credibility with live statistics.

## Features
*   **Heading & Tagline**: *"Land Your First Tech Role, Backed by AI"* highlights the fresher-first nature of the platform.
*   **Dynamic Backgrounds**: Uses gradients (such as `from-teal-500/10 to-indigo-500/10`) and glow spots to create a modern web design.
*   **Stats Cards**: Displays mock telemetry like:
    *   *12,480+ Active Jobs*
    *   *4,250+ Partner Companies*
    *   *94% Placement Success Rate*

---

# 3. Smart Job Search & Filters

## Purpose
Helps candidates search through available job listings and apply multiple criteria without refreshing the page.

## Features
*   **Dual Search Bar**: Combines keyword search (job titles, companies, tags) and location search (cities, state, or Remote).
*   **Filter Chips**: Instant filtering buttons for:
    *   *Fresher friendly*
    *   *Remote*
    *   *Hyderabad*
    *   *Frontend*
    *   *Backend*
    *   *Data*

## User Flow
1. The user types a keyword (e.g., `"React"`) in the search field.
2. The user types a location (e.g., `"Remote"`) in the location field.
3. The user clicks on one or more filter chips (e.g., *"Fresher friendly"* and *"Remote"*).
4. The list of job cards updates dynamically.

## Implementation Details
*   **Filtering Algorithm**: Filters the raw job list locally in React using `Array.prototype.filter()`.
*   **Keyword Match**: Matches against `job.title`, `job.company`, and items in `job.tags`.
*   **Chip Matching Rules**:
    *   `Fresher friendly`: Checks if `job.experience === 'Fresher friendly'`.
    *   `Remote` / `Hyderabad`: Checks if `job.location` contains these keywords (case-insensitive).
    *   `Frontend`: Evaluates if the title contains "frontend" or "designer", or if the tags contain "React".
    *   `Backend`: Checks if the title contains "backend" or if the tags contain "Node.js".
    *   `Data`: Checks if the title contains "data" or if the tags contain "Python".

---

# 4. Interactive Job Cards

## Purpose
Provides a detailed overview of individual job postings, allowing users to bookmark jobs, check match scores, and launch productivity utilities.

## Information Displayed
*   **Company Initials Badge**: Styled with unique background colors (e.g., orange for Figma, emerald for Supabase, slate for HashiCorp).
*   **Job Metadata**: Title, Company, Location, Salary, Employment Type (e.g., Full-time, Hybrid, Contract).
*   **Tech Stack Tags**: Clickable tags like `TypeScript`, `Next.js`, `Python`, `Docker`, `PyTorch`.
*   **AI Match Badge**: Color-coded score indicating compatibility.
*   **Interaction Controls**:
    *   *Save Toggle* (Bookmark icon)
    *   *Compare Checkbox*
    *   *Quick View / Action buttons* (Apply, AI Cover Letter, AI Summarize)

---

# 5. AI Match Score & Resume Simulator

## Purpose
Enables candidates to assess how well their profile fits a job and simulates real-time resume optimization.

## Features
*   **AI Match Indicator**: Displays a compatibility percentage (e.g., 95% Match) in a colored badge (higher scores are highlighted in teal/emerald).
*   **Resume Upload Simulator**: Drag-and-drop file upload container supporting PDF or DOCX file simulations.
*   **Dynamic Compatibility Adjuster**: Uploading a resume increases compatibility scores based on relevant skills matching.

## User Flow
1. The user drags a resume file or clicks the upload container.
2. An animated upload progress bar counts up from 0% to 100%.
3. Upon completion, a success toast appears (*"Resume uploaded successfully! Job matches updated."*).
4. The AI Match scores on the job cards dynamically increase.

## Implementation Details
*   **Upload Animation**: Simulated using a `setInterval` that increases `uploadProgress` state by 10% every 120ms.
*   **Dynamic Adjuster**: Handled via a React `useMemo` block. If `uploadedResume` is present, it increments the job's baseline `aiMatch` score:
    *   `+4%` match for AI/ML/NLP jobs containing Python/PyTorch/NLP tags.
    *   `+3%` match for Frontend roles containing React/TypeScript/Next.js tags.
    *   `+1%` match for other categories.
    *   Matches are capped at a maximum of `99%`.

---

# 6. AI Job Summarizer & Red Flag Detector

## Purpose
Saves time by condensing lengthy job descriptions and highlighting potential warnings about roles or companies.

## Features
*   **Paste Container**: Modal textarea to input text.
*   **Insights Breakdown**:
    *   *Key Skills Needed*: Highlights essential technologies.
    *   *Estimated Salary*: Based on market trends.
    *   *Core Responsibilities*: Bullet points of actual work.
    *   *Red Flags*: Warning indicators (e.g., legacy code migration work, fast-paced environments, unrealistic expectations).

## User Flow
1. The user clicks **AI Summarize** on a job card or in the AI Tools panel.
2. They paste a job description and click **Summarize**.
3. A loading state is displayed (*"Analyzing job description..."*).
4. The parsed summary displays the key details and highlights red flags.

## Implementation Details
*   **Analysis Delay**: Simulates a 1.5-second processing latency using `setTimeout` to mimic an API response.
*   **State Variable**: `summarizerResult` holds the structured object.

---

# 7. AI Cover Letter & Interview Prep Generator

## Purpose
Automates application preparation by drafting professional cover letters and listing mock interview questions.

## Features
*   **Personalized Cover Letters**: Generates standard cover letters using the candidate's active name, target title, and the company's details.
*   **Copy to Clipboard**: Quick copy button with a temporary checkmark animation.
*   **Interview Q&A Prep**: Generates 3 mock interview questions tailored to the technology stack of the selected job.

## User Flow
1. The user selects a job from the dropdown inside the generator.
2. They click **Generate Application Prep**.
3. The panel displays the cover letter text and 3 customized technical/behavioral interview questions.
4. The user clicks **Copy Cover Letter** to copy it to their clipboard.

## Implementation Details
*   **Custom Templates**: Templates are dynamically built in JavaScript using string interpolation. Example:
    `"Subject: Application for ${job.title} position at ${job.company}..."`
*   **Interview Question Generation**: Automatically checks the tags of the selected job to formulate custom questions (e.g., React performance questions for React roles, types for TypeScript, or LLM optimization for AI roles).

---

# 8. Multi-Job Comparison Drawer

## Purpose
Helps candidates make decisions by comparing up to three jobs side-by-side.

## Features
*   **Compare Toggle**: Checkbox on every card to add the job to the comparison list.
*   **Sticky Bottom Drawer**: Slips open from the bottom when jobs are checked.
*   **Comparison Matrix**: Renders a clean grid showing titles, companies, locations, salaries, compatibility scores, and tech tags side-by-side.

## User Flow
1. The user checks the *"Compare"* box on a job card.
2. The comparison drawer slides up from the bottom of the screen.
3. The user checks up to two additional jobs.
4. They review the comparison matrix and click **Apply** directly from the comparison view.

## Implementation Details
*   **Limit Enforcement**: Checks if `compareJobs.length >= 3` and shows a warning alert if a user tries to select a fourth job.
*   **Animation**: Uses Tailwind transitions to slide the drawer up (`translate-y-0`) and down (`translate-y-full`).

---

# 9. Profile Editor

## Purpose
Allows users to customize their candidate profile, which in turn customizes the generated cover letters and matches.

## Features
*   **Interactive Modal Form**: Inputs for Full Name, Professional Title, and Location.
*   **Status Persistence**: Changes are saved across page reloads.
*   **Success Toast Notification**: Displays a visual indicator when updates are saved.

## User Flow
1. The user clicks on the profile dropdown or navigates to the Profile section.
2. They click **Edit Profile**.
3. They update their details (e.g., name, title, location) and click **Save Changes**.
4. The profile cards and cover letter templates update instantly.

## Implementation Details
*   **LocalStorage Keys**:
    *   `candidateName`
    *   `candidateTitle`
    *   `candidateLocation`

---

# 10. Settings & Preferences

## Purpose
Gives candidates control over system notifications and toggle switches.

## Features
*   **Toggle Inputs**:
    *   *Email Alerts* for new matches.
    *   *Recruiter Messages* direct alerts.
    *   *Weekly Trends* newsletter.
*   **Preferences Persistence**: All checkboxes sync to browser local storage.

## Implementation Details
*   **LocalStorage Keys**:
    *   `pref_email` (default: `'true'`)
    *   `pref_recruiter` (default: `'true'`)
    *   `pref_weekly` (default: `'false'`)

---

# 11. Responsive Design & Accessibility

## Purpose
Ensures that the application is accessible and performs well across a variety of devices and browsers.

## Implementation
*   **Tailwind CSS Responsive Utilities**: Layouts transition from stacked columns on mobile (`grid-cols-1`) to double columns on tablet (`md:grid-cols-3` or `lg:grid-cols-12`).
*   **Semantic HTML**: Uses tags like `<header>`, `<nav>`, `<main>`, `<section>`, and `<button>` to ensure accessibility.
*   **Keyboard Navigation & Focus**: Interactive buttons and inputs have clear focus rings (`focus:ring-2 focus:ring-teal-500`) for keyboard accessibility.
*   **Screen Readers**: Includes `aria-label` attributes on icon-only buttons (like the theme toggle, notifications bell, and profile settings).
