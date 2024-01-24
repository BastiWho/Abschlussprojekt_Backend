# Login Datenflow und Format
#### api.lambda/login/googlefetch  -   [https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/login/googlefetch]()
```json
// Request  | POST api.lambda/login/googlefetch
{
    "accessToken": "ya29.a0AfB_byD3X_bD01iAW2Rvl5He3K2HUofyTjmslx5DnrL5kM_h8-8BH-AgkNvEon0S53zQPgVDYuujiGImt8q0xOYoD2Rzur3Too8vXKsL26I1lBgBGvPF5T_xJydqZi7PR3u_wJUb4bYllSeyf_iV6eSYRekHxp2HCocaCgYKAdcSARASFQHGX2Mi3R7PuSLA5saHctHwEgTHrw0170"
}
```
#### api.lambda/login/google   -    [https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/login/google]()
```json
// Response from api.lambda/login/googlefetch
// Request  | POST api.lambda/login/google
{
    "accessToken": "ya29.a0AfB_byD3X_bD01iAW2Rvl5He3K2HUofyTjmslx5DnrL5kM_h8-8BH-AgkNvEon0S53zQPgVDYuujiGImt8q0xOYoD2Rzur3Too8vXKsL26I1lBgBGvPF5T_xJydqZi7PR3u_wJUb4bYllSeyf_iV6eSYRekHxp2HCocaCgYKAdcSARASFQHGX2Mi3R7PuSLA5saHctHwEgTHrw0170",
    "status": "ok",
    "message": "user erfolgreich authentifiziert",
    "user": {
        "sub": "107109729333543740189",
        "name": "Karim Aouini",
        "given_name": "Karim\t",
        "family_name": "Aouini",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocIqaBD6Ind3rDHkOYM1ZBrZtCgEfAe6IRaZDrj7ERc=s96-c",
        "email": "karim.aouini@docc.techstarter.de",
        "email_verified": true,
        "locale": "de",
        "hd": "docc.techstarter.de"
    }
}
```
##### api.lambda/login/google
```json
// Response from api.lambda/login/google
{
    "status": "ok",
    "message": "",
    "steps": {
        "existingUser": "ok",
        "existingUserMessage": "[{\"UserID\":\"c30f4c93-eb4f-47e5-9bd9-d8c7f82a5fbc\",\"RealName\":\"Karim Aouini\",\"EmailAddress\":\"karim.aouini@docc.techstarter.de\",\"BirthDate\":null,\"Course\":null,\"AuthProvider\":\"google\",\"ProfileImg\":\"https://lh3.googleusercontent.com/a/ACg8ocIqaBD6Ind3rDHkOYM1ZBrZtCgEfAe6IRaZDrj7ERc=s96-c\",\"GoogleID\":\"107109729333543740189\"}]",
        "session": "ok"
    },
    "isNewUser": false,
    "sessionData": "91a882cf-5fa6-47d0-83cb-aef2c134d1af"
}
```