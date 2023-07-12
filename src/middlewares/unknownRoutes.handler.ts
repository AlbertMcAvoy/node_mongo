import { NotFoundException } from '~/utils/exceptions'

/**
 * For unknown routes, we return an error
 */
export const UnknownRoutesHandler = () => {
    throw new NotFoundException(`The resource you asked for doesn't exists`)
}