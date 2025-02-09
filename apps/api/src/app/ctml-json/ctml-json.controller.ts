import { Body, Controller, Delete, Get, OnModuleInit, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {CtmlJsonService} from './ctml-json.service';
import {CreateCtmlJsonDto} from './dto/create-ctml-json.dto';
import {UpdateCtmlJsonDto} from './dto/update-ctml-json.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import {KeycloakPasswordGuard} from "../auth/KeycloakPasswordGuard";
import { ctml_json, event_type, user } from "@prisma/client";
import { EventService } from "../event/event.service";
import { ModuleRef } from "@nestjs/core";
import { CurrentUser } from "../auth/CurrentUser";

@Controller('ctml-jsons')
@ApiTags('CTML JSON')
export class CtmlJsonController implements OnModuleInit {
  private eventService: EventService;

  constructor(
    private readonly ctmlJsonService: CtmlJsonService,
    private readonly moduleRef: ModuleRef
  ) {}

  onModuleInit(): any {
    this.eventService = this.moduleRef.get(EventService, { strict: false });
  }

  @Post()
  @UseGuards(KeycloakPasswordGuard)
  @ApiBearerAuth("KeycloakPasswordGuard")
  @ApiOperation({ summary: "Create a new CTML JSON record" })
  @ApiCreatedResponse({ description: "CTML JSON record created." })
  async create(
    @CurrentUser() user: user,
    @Body() createCtmlJsonDto: CreateCtmlJsonDto
  ) {
    const newCtmlJson = await this.ctmlJsonService.create(createCtmlJsonDto);
    this.eventService.createEvent({
      type: event_type.CtmlJsonCreated,
      description: "CTML JSON created via Post to /ctml-jsons",
      user,
      ctml_json: newCtmlJson,
      metadata: {
        input: {
          createCtmlJsonDto: { ...createCtmlJsonDto }
        },
        output: {
          id: newCtmlJson.id
        }
      }
    });
    return newCtmlJson;
  }

  @Get()
  @UseGuards(KeycloakPasswordGuard)
  @ApiBearerAuth("KeycloakPasswordGuard")
  @ApiOperation({ summary: "Get all CTML JSON records" })
  @ApiFoundResponse({ description: "CTML JSON records found." })
  findAll(@CurrentUser() user: user) {
    this.eventService.createEvent({
      type: event_type.CtmlJsonReadMany,
      description: "CTML JSONs read via Get to /ctml-jsons",
      user
    });
    return this.ctmlJsonService.findAll();
  }

  @Get(':id')
  @UseGuards(KeycloakPasswordGuard)
  @ApiBearerAuth("KeycloakPasswordGuard")
  @ApiOperation({ summary: "Get a CTML JSON record" })
  @ApiFoundResponse({ description: "CTML JSON record found." })
  async findOne(
    @CurrentUser() user: user,
    @Param('id') id: string
  ) {

    const ctmlJson = await this.ctmlJsonService.findOne(+id)

    // Add event
    this.eventService.createEvent({
      type: event_type.CtmlJsonRead,
      description: "CTML JSON read via Get to /ctml-jsons/:id",
      user,
      ctml_json: ctmlJson,
      metadata: {
        input: { id }
      }
    });

    return ctmlJson;
  }

  @Get('trialId/:trialId')
  @UseGuards(KeycloakPasswordGuard)
  @ApiBearerAuth("KeycloakPasswordGuard")
  @ApiOperation({ summary: "Get a CTML JSON record by Trial Id" })
  @ApiFoundResponse({ description: "CTML JSON record found." })
  async findByTrialId(
    @CurrentUser() user: user,
    @Param('trialId') trialId: string
  ) {
    const ctmlJson = this.ctmlJsonService.findByTrialId(+trialId);

    // Add event
    this.eventService.createEvent({
      type: event_type.CtmlJsonReadMany,
      description: "CTML JSONs read via Get to /ctml-jsons/trialId/:trialId",
      user,
      trial: { id: +trialId },
      metadata: {
        input: { trialId }
      }
    });

    return ctmlJson;

  }

  @Patch()
  @UseGuards(KeycloakPasswordGuard)
  @ApiBearerAuth("KeycloakPasswordGuard")
  @ApiOperation({ summary: "Update or create CTML JSON record" })
  @ApiOkResponse({ description: "CTML JSON records found." })
  async update(
    @CurrentUser() user: user,
    @Body() updateCtmlJsonDto: UpdateCtmlJsonDto
  ): Promise<ctml_json> {

    const ctmlJsons = await this.ctmlJsonService.update(updateCtmlJsonDto);

    // Add event
    this.eventService.createEvent({
      type: event_type.CtmlJsonUpdatedMany,
      description: "CTML JSONs updated via Patch to /ctml-jsons",
      user,
      metadata: {
        input: {
          updateCtmlJsonDto: { ...updateCtmlJsonDto }
        },
        affected_records: ctmlJsons.map(record => record.id)
      }
    });

    return ctmlJsons[0];
  }

  @Delete(':id')
  @UseGuards(KeycloakPasswordGuard)
  @ApiBearerAuth("KeycloakPasswordGuard")
  @ApiOperation({ summary: "Get all CTML JSON records" })
  @ApiNoContentResponse({ description: "CTML JSON record deleted." })
  async remove(
    @CurrentUser() user: user,
    @Param('id') id: string
  ) {
    await this.ctmlJsonService.remove(+id);
    // Add event
    this.eventService.createEvent({
      type: event_type.CtmlJsonDeleted,
      description: "CTML JSON deleted via Delete to /ctml-jsons/:id",
      user,
      metadata: {
        input: { id }
      }
    });
  }
}
