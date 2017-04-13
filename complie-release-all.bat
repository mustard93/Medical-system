
	@Override
	public Hospital getHospitalByCustomerCode(String customerCode) {
		SupplyDemand demand = Mongo.buildMongo().eq("customerAddressCode", customerCode).findOne(SupplyDemand.class);
		if (StringUtils.isNotBlank(demand.getHospitalId())) {
			Hospital hospital = Mongo.buildMongo().findById(demand.getHospitalId(), Hospital.class);
			if (hospital != null) {
				return hospital;
			}
		}
		return null;
	}


