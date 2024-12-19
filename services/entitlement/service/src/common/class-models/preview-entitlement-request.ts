import { Equals, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import 'reflect-metadata';

export class VideoStreamModel {
    @IsOptional()
    @IsString()
    key_id?: string;
}

export class VideoEncodingModel {
    @IsNotEmpty({ message: 'Invalid preview entitlement request. Video streams not provided' })
    video_streams: VideoStreamModel[];
}

export class VideoModel {
    @IsNotEmpty({ message: 'Invalid preview entitlement request. Video encoding not provided' })
    video_encoding: VideoEncodingModel;
}

export class PreviewEntitlementPayload{
    @IsNotEmpty({ message: 'Invalid preview entitlement request. Video not provided' })
    video: VideoModel;
}

export class PreviewEntitlementRequestModel {
    @IsNotEmpty({ message: 'Invalid preview entitlement request. Payload not provided' })
    payload: PreviewEntitlementPayload;

    @Equals('Entitlement Webhook')
    message_type: string

    @Equals('1.0')
    message_version: string
}