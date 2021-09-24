# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED/MASTER] (N/A) - yyyy-mm-dd
### Added
- Grip api integration. When there is 1 or more GRIP events related to the ARTEMIS event, a dropdown menu with the event ids is added to the hijack page. When clicked, a new tab to grip event page is opened.

### Changed

### Fixed
- LDAP behavior and correct vars

### Removed

### Deprecated

### Security

## [2.1.0] (Bellerophon) - 2021-05-17

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
