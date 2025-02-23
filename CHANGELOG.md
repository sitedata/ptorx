# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0).

This project adheres to [Semantic Versioning](https://semver.org) after `v6.7.2`.

## [Unreleased]

## [6.8.2] - 2019-10-07

### Fixed

- Closing menu from floating action button
- Pagination controls running off the page

## [6.8.0] - 2019-09-12

### Added

- Ability for users to delete their account

### Changed

- Improve warning when updating mailbox password

## [6.7.2] - 2019-08-20

### Added

- Travic CI testing and deployment

### Changed

- Improve code and tests

## [6.7.1] - 2019-07-21

### Changed

- Small updates and code tweaks

### Fixed

- CHANGELOG version links

## [6.7.0] - 2019-06-17

### Changed

- Significantly decrease app size

### Removed

- Deprecated saved message format

## [6.6.1] - 2019-05-15

### Fixed

- Cron jobs breaking from stale database connection
- Receiving emails that don't have `To` headers
- Issues caused by upgrading MariaDB (disabled `STRICT_TRANS_TABLES`)

## [6.6.0] - 2019-05-11

### Changed

- Mail storage system
- Encrypted mail now also encrypts the headers (aside from required from/to/subject/reply-to) as well as any attachments
- Main button on homepage when not logged in

### Deprecated

- Old mail storage system, which will be removed entirely 30+ days after this release

## [6.5.1] - 2019-05-04

### Fixed

- Links in HTML mail to open in a new tab
- Dark theme not working in certain parts of app

## [6.5.0] - 2019-04-27

### Added

- Primary emails that can automatically link themselves to new aliases
- Cancel button when in a manage mode
- "Select All" button for each category when in manage mode

### Changed

- An account's email is now automatically added as a verified, autolinking primary email upon registration

### Fixed

- Improve color contrast in dark theme ([#1](https://github.com/Xyfir/ptorx/issues/1))

## [6.4.1] - 2019-04-15

### Changed

- Increase rows per page for aliases and messages

### Fixed

- Deleting multiple items multiple times
- Displaying alias name in search matches

## [6.4.0] - 2019-04-14

### Added

- Helpful alert for new users
- Pricing section on homepage

## [6.3.0] - 2019-04-12

### Added

- Ability to delete multiple items at once

## [6.2.1] - 2019-04-10

### Changed

- Update Yalcs

## [6.2.0] - 2019-04-09

### Added

- [Yalcs](https://github.com/Xyfir/yalcs)

## [6.1.1] - 2019-04-03

### Fixed

- Broken links in email templates used by Accownt

## [6.1.0] - 2019-04-02

### Added

- Allow sending mail through third-party clients with our MSA server and alias SMTP credentials
- `MSA_PORT` to server config

### Changed

- Database structure
- `SMTP_PORT` to `MTA_PORT` in server config
- `TEST_SMTP_PORT` to `TEST_MTA_PORT` in server config

### Removed

- Hard-coded message size limit

## [6.0.0] - 2019-03-29

### Changed

- Release 6.0.0

[unreleased]: https://github.com/Xyfir/ptorx/compare/6.8.2...HEAD
[6.8.2]: https://github.com/Xyfir/ptorx/releases/tag/6.8.2
[6.8.0]: https://github.com/Xyfir/ptorx/releases/tag/6.8.0
[6.7.2]: https://github.com/Xyfir/ptorx/releases/tag/6.7.2
[6.7.1]: https://github.com/Xyfir/ptorx/releases/tag/6.7.1
[6.7.0]: https://github.com/Xyfir/ptorx/releases/tag/6.7.0
[6.6.1]: https://github.com/Xyfir/ptorx/releases/tag/6.6.1
[6.6.0]: https://github.com/Xyfir/ptorx/releases/tag/6.6.0
[6.5.1]: https://github.com/Xyfir/ptorx/releases/tag/6.5.1
[6.5.0]: https://github.com/Xyfir/ptorx/releases/tag/6.5.0
[6.4.1]: https://github.com/Xyfir/ptorx/releases/tag/6.4.1
[6.4.0]: https://github.com/Xyfir/ptorx/releases/tag/6.4.0
[6.3.0]: https://github.com/Xyfir/ptorx/releases/tag/6.3.0
[6.2.1]: https://github.com/Xyfir/ptorx/releases/tag/6.2.1
[6.2.0]: https://github.com/Xyfir/ptorx/releases/tag/6.2.0
[6.1.1]: https://github.com/Xyfir/ptorx/releases/tag/6.1.1
[6.1.0]: https://github.com/Xyfir/ptorx/releases/tag/6.1.0
[6.0.0]: https://github.com/Xyfir/ptorx/releases/tag/6.0.0
