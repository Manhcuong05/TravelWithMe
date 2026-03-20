import { Validators } from '@angular/forms';

export class AppValidators {
    static readonly password = [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ];

    static readonly email = [
        Validators.required,
        Validators.email
    ];

    static readonly fullName = [
        Validators.required,
        Validators.minLength(2)
    ];

    static readonly phone = [
        Validators.pattern(/^\+?[0-9]{10,12}$/)
    ];
}
