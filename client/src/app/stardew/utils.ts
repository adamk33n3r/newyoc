export abstract class ArrayUtils {
    public static ArrayGet2D<T>(array: T[], x: number, y: number, w: number): T {
        return array[(y - 1) * w + x];
    }
}
