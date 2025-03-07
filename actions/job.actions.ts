import Job from "@/modals/job.model";
import Company from "@/modals/company.model";
import { connect } from "@/db";

/**
 * ✅ Get all jobs
 */
export const getAllJobs = async () => {
  try {
    await connect();
    const jobs = await Job.find()
      .populate("companyId", "name")
      .populate("clientId", "firstName lastName company");
    return { success: true, jobs };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

/**
 * ✅ Create a new job (Must have a client)
 */
export const createJob = async (jobData: any) => {
  try {
    await connect();

    // Validate company exists
    const company = await Company.findById(jobData.companyId);
    if (!company) throw new Error("Company not found");

    // Ensure client exists in the company's clients array
    const clientExists = company.clients.some(
      (client: { _id: string }) => client._id.toString() === jobData.clientId
    );
    if (!clientExists) throw new Error("Client not found in this company");

    // Ensure location fields are provided
    if (
      !jobData.location ||
      !jobData.location.street ||
      !jobData.location.city ||
      !jobData.location.stateOrProvince ||
      !jobData.location.postalCodeOrZip ||
      !jobData.location.country
    ) {
      throw new Error("Job location is required.");
    }

    const newJob = new Job(jobData);
    await newJob.save();

    // Update the company's jobs array
    await Company.findByIdAndUpdate(
      jobData.companyId,
      { $push: { jobs: newJob._id } },
      { new: true }
    );

    return { success: true, job: newJob };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};


/**
 * ✅ Update an existing job
 */
export const updateJob = async (jobId: string, updatedData: any) => {
  try {
    await connect();

    const job = await Job.findById(jobId);
    if (!job) throw new Error("Job not found");

    // Ensure valid location fields if updating location
    if (updatedData.location) {
      if (
        !updatedData.location.street ||
        !updatedData.location.city ||
        !updatedData.location.stateOrProvince ||
        !updatedData.location.postalCodeOrZip ||
        !updatedData.location.country
      ) {
        throw new Error("All location fields are required.");
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedData, {
      new: true,
    });

    return { success: true, job: updatedJob };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

/**
 * ✅ Delete a job
 */
export const deleteJob = async (jobId: string) => {
  try {
    await connect();

    // Ensure job exists
    const job = await Job.findById(jobId);
    if (!job) throw new Error("Job not found");

    // Remove job from associated company
    await Company.findByIdAndUpdate(job.companyId, { $pull: { jobs: jobId } });

    await Job.findByIdAndDelete(jobId);

    return { success: true, message: "Job deleted successfully" };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};
