

# TTHNDR NASDAQ Task



## Starting the Metro Server



```bash
# using npm
npm start


```

 Starting Application



### For Android

```bash
# using npm
npm run android



### For iOS

```bash
# using npm
npm run ios
```


## Implementation Details

- Redux-ToolKit is used for state management
- Axios is used for API calls and rate limiting
- An activity indicator appears at the top of the list when the API request limit is exceeded
- api calls resume automatically when API is accessible
- Scrolling to the end of the page triggers the loading of more stocks
- network failures are also retried for automatically
- the search function is only triggered after a user stops typing for about 0.5 secs, this is to reduce load on API
- if API is down and search query is updated, the old api request is cancelled and the new query is used instead
- API key is embedded in Axios call headers for testing convenience

## Implementation Notes

- Image calls were implemented but were disabled as they are too many and affect usability of core functionality. 
- A priority queue for api calls was designed for handling said issue but the usability was still quite poor and hence the implementation was scrapped
- Unit tests were not implemented due to a problem with jest and module imports :    
    import * as React2 from "react";
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

- In attempt to tackle said issue, a new project was started from scratch and built up slowly.
- the problem appears to be with the Redux toolkit install as other libraries do not seem to cause said issue
- extensive debugging was done, however due to time constraints, a solution was not found. 

