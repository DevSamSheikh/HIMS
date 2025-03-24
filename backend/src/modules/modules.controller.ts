import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ModulesService } from "./modules.service";
import { CreateModuleDto } from "./dto/create-module.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("modules")
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.modulesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.modulesService.remove(id);
  }

  @Get("calculate-price")
  calculatePrice(
    @Query("moduleIds") moduleIds: string,
    @Query("promoCode") promoCode?: string,
  ) {
    const ids = moduleIds.split(",");
    return this.modulesService.calculatePrice(ids, promoCode);
  }
}
