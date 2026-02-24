# OCD Static Site Generator

A simple and flexible static site generator that creates HTML websites from structured openness data.

This tool transforms machine-readable metadata into a clean, human-readable website.

---

## Purpose

The goal of this project is to:

- Generate fully static HTML pages
- Aggregate multiple data sources
- Convert structured JSON into a public website
- Provide a transparent and automated view of organizational openness

The output is a deployable static website (no backend required).

---

## Supported Input Sources

### JSON Files

- Local structured JSON files
- Aggregated metadata files
- Validated schema-based input

### GitHub Repositories

- Repository metadata
- README content
- License information
- Releases
- Contribution files

Multiple repositories can be combined into one generated site.

### OCD Endpoint

The generator can connect to an  
`.well-known/open-contributions.json` endpoint and automatically build a public website from it.

---

## How It Works

Input Sources (JSON / GitHub / OCD)
↓
Parser & Normalizer
↓
Internal Data Model
↓
Template Engine
↓
Static HTML Output

---

## What the Generated Website Can Include

- Organization overview page
- Project listings
- Dataset pages
- Standards participation overview
- Links to repositories and documentation
- Machine-readable interface references

---

## Extensibility

- Custom fields can be mapped
- Templates can be overridden
- Themes can be added
- Additional data connectors can be implemented

The system is designed to remain flexible and adaptable.

---
