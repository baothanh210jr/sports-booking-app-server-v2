import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    async create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @Get()
    async findAll() {
        return this.bookingsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.bookingsService.deleteBooking(id);
    }
}
