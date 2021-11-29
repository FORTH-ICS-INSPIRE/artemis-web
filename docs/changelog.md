# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED/MASTER] (TBD) - 2021-12-03

### Added

- every api call now has a rate limit. The limit is per api endpoint, so it is not a global counter. The default value is 20 requests per 15 minutes. The user has to define 2 extra environmental variables:
  - LIMIT_WINDOW specifies the time window in ms.
  - LIMIT_REQUESTS specifies the number of allowed requests in that secific time window.
- GRIP api integration. When there is 1 or more GRIP events related to the ARTEMIS event, a dropdown menu with the event ids is added to the hijack page. When clicked, a new tab to grip event page is opened.
- Signup and Login forms now include a captcha field for bot protection. The user has to additionally define the following `.env` variables:
  - `CAPTCHA_SECRET`. This would preferably be a long random hash value.
  - `CAPTCHA_WINDOW` specifies the time where the false login attempt count is valid.
  - `CAPTCHA_TRIES` is the number of unsuccessful login attempts that are needed to trigger the CAPTCHA generation.
- New env var `ARTEMIS_WEB_BASE_DIR` specifies the ARTEMIS web base directory (default: empty).
- Condition to limit GRIP events association to 1 hour time window w.r.t. ARTEMIS alerts.
- A web command line search experience based on https://saharmor.github.io/react-super-cmd. To trigger the search modal:
  - Windows + Linux OS: ctrl + Windows key (super) + k
  - MacOS : cmd + k
- Gitpod integration
- Additional Integration and Unit tests
- Unauthorized action notifications

### Changed

- migrated to Nextjs 12.0.2 and SWC

### Fixed

- LDAP behavior and correct vars
- Admin login bug
- Bug with logout warning popup
- GQL ports in frontend
- `login` and `JWT` auth calls and documentation
- Timezone issues with some timestamps

## [2.1.0] (Bellerophon) - 2021-05-17

### Changed

- Placed the table content filters on top position instead of the bottom. Affected pages: /dashboard, /bgpupdates, /hijacks, /hijack
- Placed the Download table button on the top left position instead of top right. Affected pages: /dashboard, /bgpupdates, /hijacks, /hijack
- Updgraded next.js version 10.0 -> 10.2
- Export CSV is now a separate component
- Timestamps now support the Today and Yesterday flag
- Table pagination both top and bottom positions
- Signup and Login forms now include a captcha field for bot protection
- Every api call now has a rate limit. The limit is per api endpoint, so it is not a global counter. The default value is 20 requests per 15 minutes.

### Fixed

- Export CSV is now rename as ExportJSON
- Fix big margins on dashboard
