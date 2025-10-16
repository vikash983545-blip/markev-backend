# MarkEv Android Project

A Kotlin-based Android application with MVVM architecture.

## Project Structure

```
com.markev.app/
│
├── data/
│   ├── api/
│   │   └── AuthApi.kt
│   ├── model/
│   │   └── AuthModels.kt
│   ├── repository/
│   │   └── AuthRepository.kt
│
├── di/
│   └── NetworkModule.kt
│
├── ui/
│   ├── splash/
│   │   └── SplashActivity.kt
│   ├── login/
│   │   └── LoginActivity.kt
│   ├── register/
│   │   └── RegisterActivity.kt
│   └── dashboard/
│       ├── OwnerDashboardActivity.kt
│       └── UserDashboardActivity.kt
│
├── utils/
│   ├── PrefsManager.kt
│   └── AuthInterceptor.kt
│
└── MarkEvApp.kt
```

## Features

- **Architecture**: MVVM (Model-View-ViewModel)
- **Language**: Kotlin
- **Minimum SDK**: 21
- **Target SDK**: 33
- **Dependencies**: AndroidX, ViewModel, LiveData, Coroutines, Retrofit2, OkHttp3

## Setup

1. Open the project in Android Studio
2. Sync Gradle files
3. Run the application

## Activities

- **SplashActivity**: Launch screen with app logo
- **LoginActivity**: User authentication
- **RegisterActivity**: User registration
- **OwnerDashboardActivity**: Dashboard for property owners
- **UserDashboardActivity**: Dashboard for regular users

## Notes

- The project is set up with proper package structure and dependencies
- All activities extend AppCompatActivity and follow MVVM pattern
- Network module is configured with Retrofit and OkHttp
- SharedPreferences manager is available for data persistence
