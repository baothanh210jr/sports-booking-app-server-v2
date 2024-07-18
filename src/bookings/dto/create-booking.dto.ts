export class CreateBookingDto {
    readonly userId: string;
    readonly sportsFieldId: string;
    readonly date: Date;
    readonly startTime: string;
    readonly endTime: string;
}
