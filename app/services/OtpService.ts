// app/services/OtpService.ts
import { PythonShell } from "react-native-python";

export const OtpService = {
    async generateOtp(): Promise<string> {
        return new Promise((resolve, reject) => {
            PythonShell.runString(
                `
        from backend.otp import generate_otp
        print(generate_otp())
      `,
                null,
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                },
            );
        });
    },

    async sendOtp(email: string, otp: string): Promise<void> {
        return new Promise((resolve, reject) => {
            PythonShell.runString(
                `
        from backend.otp import send_otp_email
        success = send_otp_email("${email}", "${otp}")
        print(success)
      `,
                null,
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        results[0] === "True"
                            ? resolve()
                            : reject("Failed to send OTP");
                    }
                },
            );
        });
    },
};
