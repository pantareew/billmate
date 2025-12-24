# BillMate
## Overview
This app is a smart bill‑splitting platform built to make managing shared expenses effortless. It removes the hassle of manual calculations by automating receipt extraction, debt tracking, and balance management. Users simply upload a receipt, choose a group, and the app takes care of splitting costs, updating payment statuses, and keeping everything transparent.

## Features
* AI receipt upload using OpenAI Vision to auto-extract bill data
* Group-based bill splitting with per-user payment tracking
* Payment workflows (pay, upload receipt, approve payments)
* Dashboard insights showing how much you owe and are owed
* Real-time notifications for new bills and receipt approvals
* Secure authentication using Supabase Auth
* Receipt storage via Supabase Storage

## Technologies
* Frontend: Next.js (App Router), TypeScript, Tailwind CSS
* Backend: FastAPI (Python)
* Database: PostgreSQL
* Auth & Storage: Supabase
* AI: OpenAI Vision
