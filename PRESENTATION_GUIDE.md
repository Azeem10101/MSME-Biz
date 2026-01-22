# MSME Assistant (Project Gravity) - Presentation Guide

**Project Name:** MSME BIZ / Gravity Assistant  
**Tagline:** "Bringing AI-powered Analytics to the Nukkad Kirana Store"

---

## 1. The Hook (30 Seconds)
**Script:**
> "There are over 63 million MSMEs in India. Most of them still run on pen and paper because existing software is too complex, too expensive, or requires formal English.
> 
> Meet **Gravity** (or MSME BIZ). It’s an AI business assistant that understands *how* Indians actually speak—Hinglish, informal, and messy—and turns it into professional, structured financial data instantly. It’s like having a Chartered Accountant in your pocket who listens to you."

---

## 2. The Problem
*   **Language Barrier:** Owners speak mix of Hindi/English (Hinglish), not formal accounting terms.
*   **Complexity:** They don't want to fill 10 fields in a form. They just want to say "sold 2 milk packets".
*   **Data Blindness:** They know how much cash is in the drawer, but not their most profitable item or actual net profit.

---

## 3. The Solution (Key Features)
Highlight these 3 pillars:
1.  **Natural Language Input**: Handles "2 doodh bik gaye" just as well as "Sold 2 units of milk".
2.  **Instant Analytics**: Asks questions like "Who is my best customer?" or "Profit aaj ka?" and utilizes the database to give exact numbers.
3.  **Automated Inventory**: Selling an item automatically reduces stock.

---

## 4. The Tech Stack (Badge of Honor)
When judges ask "How does it work?", show this slide:

*   **AI Engine**: **Google Gemini 2.0 Flash**. Chosen for its speed and superior handling of Indian languages/context.
*   **Backend**: **FastAPI** (Python). For high-performance async processing.
*   **Frontend**: **React + Vite**. For a snappy, modern web experience.
*   **Data Reliability**: Uses **Pydantic** strict schemas to ensure the AI *never* hallucinates data fields. It forces the chaotic AI output into a strict database row.

---

## 5. Live Demo Flow (Critical!)
Do not just talk. Show it live. Follow this script:

**Step 1: The Sale (Show Informal Input)**
*   *Action*: Type/Say: *"Sold 5 packets of Amul Gold milk and 2 breads today"*
*   *Result*: Show the UI extracting `Product: Amul Gold`, `Qty: 5`, `Product: Bread`, `Qty: 2`.
*   *Point*: "Notice I didn't click any dropdowns. I just spoke naturally."

**Step 2: The Insight (Show 'System Match')**
*   *Action*: Type: *"Show me my top selling items"* or *"Aaj ka profit kitna hai?"*
*   *Result*: Show the professional summary card.
*   *Point*: "It didn't just search text. It queried the SQL database and calculated real-time profit."

**Step 3: The Report (The 'Wow' Visual)**
*   *Action*: Click "Export PDF" or "View Dashboard".
*   *Result*: Show the Brutalist/High-Contrast report.
*   *Point*: "In one click, the shopkeeper gets a professional statement they can share with a bank for a loan."

---

## 6. Likely Judge Questions & Answers

**Q: How do you handle wrong data or hallucinations?**
**A:** "We use strict Schema Validation (Pydantic). If the AI output doesn't match our exact data types (like a missing price or date), the system rejects it and asks the user to clarify, rather than saving bad data."

**Q: Why Gemini 2.0?**
**A:** "It has significantly better context windows and speed for the price point, which is critical for MSMEs where every rupee counts. Its ability to understand Hinglish nuances outperformed others in our tests."

**Q: Is it scalable?**
**A:** "Yes, the backend is stateless. The database can easily be swapped from SQLite to PostgreSQL for millions of users."
