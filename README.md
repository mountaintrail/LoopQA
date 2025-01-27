# LoopQA

* The structure simplifies adding or removing tasks from the test flow.
* Ss needs change, you only update data.json or the verification function, maintaining clear separation between test logic and test data.

Test Loop
* Walk through how the main test block loops over each entry in your data.json.
* For each item, the test:
    1. Navigates to the app.
    2. Logs in with provided credentials.
    3. Loads the page and waits for content to be ready.
    4. Calls the verification function for the specific task name, section, and tags.
    5. Finally, logs any useful message (e.g., verifying if itâ€™s in the correct column).
