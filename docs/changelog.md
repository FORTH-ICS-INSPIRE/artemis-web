# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED/ui-refactor] (latest) - 2021-05-10

### Changed

- Placed the table content filters on top position instead of the bottom. Affected pages: /dashboard, /bgpupdates, /hijacks, /hijack
- Placed the Download table button on the top left position instead of top right. Affected pages: /dashboard, /bgpupdates, /hijacks, /hijack
- Updgraded next.js version 10.0 -> 10.2
- Export CSV is now a separate component
- Timestamps now support the Today and Yesterday flag
- Table pagination both top and bottom positions

### Fixed

- Export CSV is now rename as ExportJSON
- Fix big margins on dashboard
