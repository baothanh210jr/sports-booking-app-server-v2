import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument } from 'src/database/schemas/bookings';

@Injectable()
export class BookingsService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) { }

    async create(createBookingDto: CreateBookingDto): Promise<Booking> {
        const createdBooking = new this.bookingModel(createBookingDto);
        return createdBooking.save();
    }

    async findAll(): Promise<Booking[]> {
        return this.bookingModel.find().exec();
    }

    async findOne(id: string): Promise<Booking | undefined> {
        return this.bookingModel.findById(id).exec();
    }

    async deleteBooking(id: string): Promise<Booking> {
        return this.bookingModel.findByIdAndDelete(id).exec();
    }
}
