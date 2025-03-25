import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModuleEntity } from "./entities/module.entity";
import { CreateModuleDto, UpdateModuleDto } from "./dto";

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepository: Repository<ModuleEntity>,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<ModuleEntity> {
    const module = this.modulesRepository.create(createModuleDto);
    return this.modulesRepository.save(module);
  }

  async findAll(): Promise<ModuleEntity[]> {
    return this.modulesRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<ModuleEntity> {
    const module = await this.modulesRepository.findOne({
      where: { id, isActive: true },
    });
    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    return module;
  }

  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<ModuleEntity> {
    const module = await this.findOne(id);
    Object.assign(module, updateModuleDto);
    return this.modulesRepository.save(module);
  }

  async remove(id: string): Promise<void> {
    const result = await this.modulesRepository.update(id, { isActive: false });
    if (result.affected === 0) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
  }

  async calculatePrice(
    moduleIds: string[],
    promoCode?: string,
  ): Promise<{ subtotal: number; discount: number; total: number }> {
    const modules = await Promise.all(moduleIds.map((id) => this.findOne(id)));
    const subtotal = modules.reduce(
      (sum, module) => sum + Number(module.price),
      0,
    );

    // Apply bundle discount based on number of modules
    let bundleDiscount = 0;
    if (modules.length >= 3) {
      bundleDiscount = subtotal * 0.1; // 10% discount for 3+ modules
    } else if (modules.length === 2) {
      bundleDiscount = subtotal * 0.05; // 5% discount for 2 modules
    }

    // Apply promo code discount if provided
    let promoDiscount = 0;
    if (promoCode) {
      // Mock promo codes - in a real app, these would be stored in the database
      const promoCodes = {
        WELCOME10: 0.1, // 10% off
        HEALTH20: 0.2, // 20% off
        CLINIC15: 0.15, // 15% off
        FIRST25: 0.25, // 25% off
      };

      const discountRate =
        promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];
      if (discountRate) {
        promoDiscount = (subtotal - bundleDiscount) * discountRate;
      }
    }

    const totalDiscount = bundleDiscount + promoDiscount;
    const total = subtotal - totalDiscount;

    return {
      subtotal,
      discount: totalDiscount,
      total,
    };
  }
}
