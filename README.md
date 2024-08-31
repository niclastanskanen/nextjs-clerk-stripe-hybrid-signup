# Hybrid Sign-Up and Subscribe Form with Stripe

This repository demonstrates how to build a hybrid sign-up and subscription form using [Clerk](https://clerk.com) for authentication and [Stripe](https://stripe.com) for payment processing. The form allows users to sign up and subscribe to a service in a single, streamlined process.

  <div align="center">
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

- **Live site**: https://nextjs-clerk-stripe-hybrid-signup.vercel.app/

<img src="public/sign-up.png" alt="Sign-Up Form" width="250"/>
<img src="public/verification.png" alt="Verification" width="200"/>
<img src="public/dashboard.png" alt="Dashboard" width="200"/>


## Features

- **User Authentication**: Integrates Clerk for user sign-up and login.
- **Payment Integration**: Uses Stripe to handle subscription payments.
- **Hybrid Form**: Combines user registration and subscription in one form.
- **UI/Component Library**: [shadcn](https://ui.shadcn.com/)

## Flow step by step

1. When the user submits the form, the card details are sent to Stripe to tokenize the card. That token, and the selected product, are stored as `unsafeMetadata`.

2. The app will signal to Clerk that a user is trying to sign up.
3. Clerk sends the user an OTP to their email.
4. The user enters the code into the application.
5. The app signals to Clerk that the user completed the signup and the account should be created.
6. The `user.created` webhook is triggered and the payload is sent to an API route in the application.
7. The webhook handler uses the Stripe SDK to create a payment method, customer, and subscription.
8. Once done, the user record is updated from Next and the user is allowed to proceed