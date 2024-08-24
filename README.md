# BunnyLog 🐇

BunnyLog is a simple and customizable logging utility for Node.js applications. It allows you to log messages with different categories and colors, making it easier to distinguish between various types of log messages.

## Features

- **Category-based Logging**: Log messages with different categories such as `server`, `database`, `error`, `info`, `success`, `warn`, and `api`.
- **Color-coded Output**: Each category is associated with a specific color for easy identification.
- **JSON Object Logging**: Automatically formats and colorizes JSON objects for better readability.
- **Dynamic Custom Category**: Easily add new log categories with custom colors at runtime.

## Installation

```bash
npm install bunnylog
```

## Usage

### Import BunnyLog
```Javascript
import { bunnyLog } from './bunnyLog';
```

### Logging Messages
```Javascript
bunnyLog.server( 'This is server message.')
bunnyLog.info('This is an informational message.');
bunnyLog.error('An error occurred:', new Error('Sample error'));
bunnyLog.success('Operation completed successfully.');
bunnyLog.warning('This is a warning message.');
bunnyLog.api('API request received');
bunnyLog.database('Database message.')
bunnyLog.object({ key: 'value', anotherKey: 42 });
```

### Adding a New Category

You can dynamically add new categories with custom colors:
```Javascript
import chalk from 'chalk'

// Add a new log category 'debug' with a custom color
bunnyLog.addCategory('debug', chalk.cyan)
bunnyLog.addCategory('debug', chalk.hex('#ffffff')) // you can also use hex code

// Use the new category
bunnyLog.debug('This is a debug message.')
```

### Example Outputs

*Server*

<img alt="Server Message" src="https://imgur.com/fUJmZHa.png">

*Info*

<img alt="Info Message" src="https://imgur.com/r6Dx353.png">

*Error*

<img alt="Error Message" src="https://imgur.com/pAd3wEs.png">

*Success*

<img alt="Success Message" src="https://imgur.com/oYwKSPu.png">

*Warning*

<img alt="Warning Message" src="https://imgur.com/5E9AoqR.png">

*Api*

<img alt="Api Message" src="https://imgur.com/fjQw9le.png">

*Database*

<img alt="Database Message" src="https://imgur.com/W5B3Tr2.png">

*Object*

<img alt="Object Message" src="https://imgur.com/XVK8TBA.png">

*Custom Category*

<img alt="Custom Category" src="https://imgur.com/gi0IK63.png">

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.
