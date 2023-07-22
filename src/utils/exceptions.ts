import { ApiException } from '~/types/exceptions'

/**
 * Abstract class used to make HTTP errors
 *
 * Precise there that the class implements `ApiException`
 *
 * keyword `readonly` are shortcut for `this.propriété = valeur`,
 * prevent change values later.
 *
 */
export class AbstractException implements ApiException {
    constructor(readonly error: any, readonly status: number) {}
}

/**
 * Create 404
 */
export class NotFoundException extends AbstractException {
    constructor(error: any) {
        super(error, 404)
    }
}

/**
 * Create 400
 */
export class BadRequestException extends AbstractException {
    constructor(error: any) {
        super(error, 400)
    }
}

/**
 * Create 401
 */
export class UnauthorizedException extends AbstractException {
    constructor(error: any) {
        super(error, 401)
    }
}

/**
 * Create 409
 */
export class ConflictException extends AbstractException {
    constructor(error: any) {
        super(error, 409)
    }
}