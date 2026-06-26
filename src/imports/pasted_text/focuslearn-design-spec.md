Design a complete responsive frontend for a web-based e-learning platform called FocusLearn.

Project Context

FocusLearn is a final-year Computer Science project that investigates how minimalist user interfaces can improve knowledge retention by reducing cognitive load.

The interface must be grounded in:

Cognitive Load Theory (CLT)
Cognitive Theory of Multimedia Learning (CTML)
Progressive disclosure
One primary task per screen
Maximum of 2 clicks to reach any content
Minimal visual distractions

The platform is primarily used by Nigerian university students on smartphones and limited mobile data connections.

Design System
Visual Style
Modern minimalist design
Professional educational product
Clean and calming interface
Large white spaces
No gradients
No glassmorphism
No neumorphism
No decorative illustrations except where necessary
Minimal icons only for navigation and actions
Rounded corners (12px)
Soft borders (#E5E7EB)
Subtle transitions and micro-interactions
Color Palette
Primary Background
White: #FFFFFF
Off White: #FAFAFA
Primary Dark
Dark Navy: #1A3A5C

Use for:

Headers
Sidebar
Navigation
Cards requiring emphasis
Accent
Teal: #16A085

Use for:

Buttons
Active states
Progress indicators
Charts
Focus states
Neutral Colors
Gray 50: #F9FAFB
Gray 100: #F3F4F6
Gray 300: #D1D5DB
Gray 500: #6B7280
Gray 700: #374151
Typography

Font Family:
Inter

Heading

18px–24px
Weight: Bold (700)

Body

14px–16px
Weight: Regular (400)

Caption

11px–12px
Weight: Medium (500)
Color: Gray 500

Spacing system:
8px base grid

Responsiveness

Create:

Mobile First (375px width)
Tablet (768px)
Desktop (1440px)

The experience should feel excellent on mobile devices.

Components

Create reusable components:

Primary Button
Secondary Button
Ghost Button
Input Field
Password Field
Dropdown
Checkbox
Radio Button
Progress Bar
Stepper
Quiz Option Card
Statistic Card
Module Card
Analytics Card
Table
Modal
Toast Notification
Empty State
Error State
Confirmation Dialog
Pagination
Sidebar Navigation
Top Navigation
Loading States

Every page must have Skeleton Loading Screens.

Use skeleton loaders instead of spinners.

Examples:

Dashboard Loading
Skeleton header
Skeleton module card
Skeleton buttons
Skeleton statistics
Lesson Loading
Skeleton title
Skeleton paragraph lines
Skeleton progress bar
Skeleton navigation buttons
Quiz Loading
Skeleton question block
Skeleton answer cards
Skeleton navigation button
Admin Table Loading
Skeleton rows
Skeleton cards
Skeleton charts

Animate skeletons using subtle shimmer effects.

Loading states must reduce perceived waiting time and maintain layout stability.

Student Pages
1. Landing Page (/)

Sections:

Hero
Value proposition
How FocusLearn Works
Features
Call to Action
Login/Register buttons

Hero text:

Learn Better.
Retain More.

Minimalist learning designed to improve concentration and long-term memory.

Buttons:

Get Started
Learn More
2. Register Page (/register)

Two-column desktop layout.

Fields:

Full Name
Email
Password
Confirm Password

Button:
Create Account

Small educational illustration on desktop only.

3. Login Page (/login)

Fields:

Email
Password

Button:
Sign In

Links:

Create Account
Forgot Password
4. Student Dashboard (/dashboard)

Header:
Welcome back, [Student Name]

Cards:

Current Module Card:

Module title
Description
Progress percentage
Begin Module button

Study Reminder Card

Recent Performance Card

Layout:
One primary CTA only.

5. Lesson Viewer (/lesson/:moduleId)

Display content section by section.

Elements:

Lesson title
Progress indicator
Previous button
Next button
Reading progress bar

Layout should maximize readability.

Long text width:
650px maximum.

No sidebars.

6. Immediate Recall Quiz (/quiz/:moduleId/immediate)

Show:

Question 1 of 20

One question at a time.

Answer options:
Large radio cards.

Buttons:

Previous
Next
Submit

Include progress indicator.

7. NASA-TLX Survey (/survey/:moduleId)

Six sliders:

Mental Demand
Physical Demand
Temporal Demand
Performance
Effort
Frustration

Each:
0–100 scale

Large touch-friendly sliders.

Button:
Submit Survey

8. Immediate Results (/results/:moduleId/immediate)

Show:

Circular score indicator

Cards:

Score
Correct Answers
Time Taken
NASA-TLX Score

Button:
Continue

9. Delayed Quiz (/quiz/:moduleId/delayed)

Same design as Immediate Quiz.

Add notice:

This assessment is available 48–72 hours after completing the lesson.

10. Delayed Results (/results/:moduleId/delayed)

Cards:

Immediate Score
Delayed Score
Retention Difference

Simple comparison chart.

Button:
Return to Dashboard

Admin Pages

Admin uses left sidebar navigation.

Sidebar items:

Dashboard
Modules
Quizzes
Participants
Analytics
Results
Export
Settings
Logout
11. Admin Login

Simple centered login card.

12. Admin Dashboard

Cards:

Total Participants
Control Group
Experimental Group
Average NASA-TLX
Immediate Recall Average
Delayed Recall Average

Charts:

Cognitive Load Comparison
Retention Comparison
13. Modules Page

Table:

Title
Lessons
Quizzes
Status
Actions

Button:
New Module

14. Create Module

Fields:

Module Title
Description
Number of Sections
Status

Buttons:
Save
Cancel

15. Edit Module

Pre-filled form.

Buttons:
Update
Cancel

16. Quiz Management

Table:

Quiz Name
Module
Questions
Actions

Button:
New Quiz

17. Create Quiz

Fields:

Module
Quiz Type
Number of Questions

Question builder:

Question
Four options
Correct answer
Explanation
18. Edit Quiz

Same layout as Create Quiz.

19. Participants

Table:

Name
Email
Device
Group
Status

Search
Filter
Pagination

20. Assign Groups

Two cards:

Control Group
Experimental Group

Participant selector.

Button:
Assign

21. Analytics Dashboard

Cards:

Average NASA-TLX
Immediate Recall
Delayed Recall
Retention Rate

Charts:

Bar Chart
Line Chart
Retention Comparison

Charts should use only navy and teal.

22. Results Management

Large table:

Participant
Group
Immediate Score
Delayed Score
NASA-TLX
Time-on-Task

Search
Sort
Filters
Pagination

23. Export Data

Cards:

Participants
Test Results
NASA-TLX
Session Logs

Buttons:
Export CSV

System Pages
Unauthorized Page

Large lock icon.
Message:
You do not have permission to access this page.

Button:
Return Home

404 Page

Large "404"
Message:
Page Not Found

Button:
Go Home

Motion

Use Framer Motion style interactions:

Fade in
Slide up
Hover elevation
Button press feedback
Smooth page transitions under 300ms

Animations should be subtle and non-distracting.

Deliverables

Generate:

Design system and style guide
Component library
Mobile screens
Tablet screens
Desktop screens
Interactive prototype
Skeleton loading screens for every page
Light mode only
Production-ready layouts suitable for React + Tailwind CSS implementation

Design Goal: A distraction-free, minimalist e-learning platform that measurably reduces cognitive load and improves knowledge retention while maintaining a modern SaaS-quality user experience.
